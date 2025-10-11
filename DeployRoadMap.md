🚀 DeployRoadMap.md

UnifiedMandala – Webfrontend & Server-Setup

1.  Infrastruktur & Domain

    Entscheide:

        Strato/Shared Hosting: Schnell, kein Root-Zugang, FTP-Upload.

        Eigener Server/VPS: Volle Kontrolle, mehr Möglichkeiten (empfohlen für Wachstum).

    Domain vorbereiten:

        Domain registrieren (z. B. über Strato)

        DNS prüfen: A-Record zeigt auf Server-IP.

2.  Server-Setup (bei VPS/Root-Server)

    Betriebssystem installieren:

        Ubuntu 22.04 LTS oder Debian 12

    Nutzer & Sicherheit:

        Benutzer anlegen: adduser mandala

        SSH-Key einrichten

        Firewall aktivieren (ufw allow OpenSSH, ufw enable)

    Node.js & Build-Tools installieren:

curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs build-essential

Webserver einrichten (Nginx empfohlen):

    sudo apt install -y nginx
    sudo systemctl enable nginx
    sudo systemctl start nginx

3. Frontend Build & Deployment

   Frontend klonen & bauen:

git clone https://github.com/GenesisAeon/unifiedmandala-ui.git
cd unifiedmandala-ui
npm ci
npm run build

Build deployen:

sudo mkdir -p /var/www/mandala
sudo cp -r build/\* /var/www/mandala/
sudo chown -R www-data:www-data /var/www/mandala

Nginx-Konfiguration anlegen

    Datei: /etc/nginx/sites-available/mandala.conf

server {
listen 80;
server_name deine-domain.de www.deine-domain.de;
root /var/www/mandala;
index index.html;
location / {
try_files $uri $uri/ /index.html;
}
}

    Aktivieren & testen:

sudo ln -s /etc/nginx/sites-available/mandala.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

Bei einem GhostShellAgent im Cluster-Modus musst du alle Worker-Ports an Nginx
weiterleiten. Erzeuge die Upstream-Datei mit
`pnpm generate:ghostshell-nginx` (Variablen `PORT_BASE` und `WORKER_COUNT` oder
`PORT_RANGE` setzen) und binde sie anschließend unter
`/etc/nginx/conf.d/ghostshell.conf` ein.

SSL aktivieren (Let’s Encrypt):

    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d deine-domain.de -d www.deine-domain.de

4. SPA-Routing (.htaccess für Strato & Co.)

   Nur bei klassischem Webspace:
   Lege im Build-Ordner eine .htaccess an:

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

5.  CI/CD (optional)

    GitHub Actions: Automatischer FTP-Upload nach jedem Push (nur bei Strato/Webspace)

    Deploy-Skript/Cronjob: Für eigenen Server, automatisiertes Build & Kopieren

6.  Test & Smoke Check

    Domain aufrufen (https://deine-domain.de)

    Alle Pfade (z. B. /dashboard, /sigil) testen

    404 → .htaccess oder Nginx-Config prüfen

7.  Nächste Ausbaustufen

    Backend-API: Node/Go-Services, ggf. Docker/Kubernetes

    MemoryManager, Agenten, CREP-Engine Schritt für Schritt deployen

    Monitoring & Backup: z. B. UptimeRobot, automatische Sicherungen

8.  Troubleshooting & Tipps

    Fehler? Sieh in die Logs:

        Nginx: /var/log/nginx/error.log

        Node: Konsolenausgabe prüfen

    Support:

        Bei Fragen einfach im Projekt-Chat oder via Issue melden!

Checkliste (für deinen README-Status)

Server/VPS/Hosting besorgt

Domain zeigt auf Ziel-Server

Node.js & Nginx installiert

Frontend gebaut & deployed

SPA-Routing (.htaccess/Nginx) aktiv

HTTPS aktiv

Smoke-Test bestanden

    CI/CD vorbereitet

Fertig! Ab jetzt ist dein UnifiedMandala-Frontend für die Welt erreichbar.
Viel Erfolg beim Launch und Deployen! 🚀
