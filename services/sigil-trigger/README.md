# Sigil Trigger Service

This utility watches the `docs/sigils` directory for changes to `*.sigil.json` files.
Whenever a sigil file is updated, it regenerates the sigil relation graph using `sigillin-cli.js`.

Run `./trigger.sh` from the repository root. `inotifywait` must be available on the system.
