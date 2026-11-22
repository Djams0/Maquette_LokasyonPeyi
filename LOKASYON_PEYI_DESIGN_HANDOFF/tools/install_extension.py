"""Install or preview the design handoff in a disposable Git review checkout."""
import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

source = Path(__file__).resolve().parents[1]


def git(repo, *args):
    return subprocess.check_output(['git', '-C', str(repo), *args], text=True).strip()


def files(folder):
    return {p.relative_to(folder).as_posix(): p for p in folder.rglob('*') if p.is_file()}


def verify(folder):
    for name in ('verify_v32.py', 'verify_extension.py'):
        subprocess.run([sys.executable, str(folder / 'tools' / name)], check=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('repository', type=Path)
    parser.add_argument('--mode', choices=('overlay', 'replace'), default='overlay')
    parser.add_argument('--apply', action='store_true', help='Appliquer avec sauvegarde; aperçu par défaut.')
    args = parser.parse_args()
    repo = args.repository.resolve()
    if Path(git(repo, 'rev-parse', '--show-toplevel')).resolve() != repo:
        parser.error('Indiquer la racine Git de Maquette_LokasyonPeyi.')
    if source.is_relative_to(repo):
        parser.error('Extraire le kit en dehors du dépôt avant installation.')
    branch = git(repo, 'branch', '--show-current')
    if not branch or branch in ('main', 'master'):
        parser.error('Utiliser une branche dédiée.')
    base = json.loads((source / 'HANDOFF_MANIFEST.json').read_text(encoding='utf-8'))['base']
    if git(repo, 'rev-parse', 'HEAD') != base:
        parser.error('SHA différent de la base auditée. Relire le diff de version avant une intégration manuelle.')
    destination = repo / source.name
    if git(repo, 'status', '--porcelain', '--untracked-files=all', '--', source.name):
        parser.error('Changements locaux dans le handoff. Les sauvegarder dans Git avant de reprendre.')
    if destination.is_symlink() or not destination.is_dir():
        parser.error('Dossier d’origine absent ou chemin redirigé.')
    verify(source)
    present, incoming = files(destination), files(source)
    additions = sorted(incoming.keys() - present.keys())
    extra = sorted(present.keys() - incoming.keys())
    shared = incoming.keys() & present.keys()
    changed = sorted(path for path in shared if incoming[path].read_bytes() != present[path].read_bytes())
    print(f'{branch} · mode {args.mode} · {len(additions)} ajouts, {len(changed)} changements, {len(shared) - len(changed)} conservés.')
    for label, changes in [('AJOUT', additions), ('ACTUALISE', changed), ('HORS KIT', extra)]:
        for path in changes:
            print(f'{label} {path}')
    if extra:
        parser.error('Dossiers additionnels à revoir: le vérificateur exige un inventaire exact. Préserver les fichiers et résoudre la migration avant application.')
    if not args.apply:
        return
    stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
    backup = repo.parent / f'{repo.name}-handoff-backup-{stamp}'
    with tempfile.TemporaryDirectory(dir=repo, prefix='.handoff-install-') as tmp:
        staged = Path(tmp) / source.name
        if args.mode == 'overlay':
            shutil.copytree(destination, staged)
            for rel in [*additions, *changed]:
                target = staged / rel
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(incoming[rel], target)
        else:
            shutil.copytree(source, staged)
        destination.rename(backup)
        installed = False
        try:
            staged.rename(destination)
            installed = True
            verify(destination)
        except BaseException:
            if installed:
                destination.rename(staged)
            backup.rename(destination)
            raise
    print(f'Installation vérifiée. Sauvegarde conservée: {backup}')


if __name__ == '__main__':
    main()
