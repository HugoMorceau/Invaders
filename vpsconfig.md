** Reset ssh key **
```
ssh-keygen -R adresse-ip-du-serveur
```
**Maj du système**
```
apt-get update 
apt-get upgrade
```
**Installation de NPM et Node**
```
apt-get install npm
node -v npm-v
npm i -g n
n install lts
n use 16.16.0 // ou la version installée par LTS
```
*exit and relog avec SSH*

**Installation de GIT**
```
apt install git-all
```
**Génération de la clef SSH**
```
ssh-keygen -t rsa
cd ~/
cd .ssh
cat id_rsa.pub
```
*copy paste the key to github*

**Téléchargement du repo github**
```
git clone -b <branch> <remote_repo>
```
*A ce niveau on peut déjà tester en lancant le serveur avec node :*
```
node index.js 
```
*Et en accédant au site en spécifiant l'url et le port :* 
```
www.hugomorceau.com:3000
```

**Automatisation lancement serveur avec PM2**
```
npm install -g pm2
```
*dans le dossier contenant les sources :*
```
 pm2 start index.js -n hugomorceau 
 ```
(Ci dessus, hugomorceau = le nom qu'on veut donner au demon pm2)

On peut retester que le site est toujours accessible depuis l'exterieur en spécifiant le port :
```www.hugomorceau.com:3000```

**Fait démarrer pm2 au rédémarage du serv**
```
pm2 start ubuntu
```

**Reverse proxy avec NGINX**
```
apt-get install nginx
cd ~
cd /etc/nginx
cd sites-available/
nano default
```
modifier la ligne :  
```
server_name _;
```  
remplacer par 
```
server_name hugomorceau.com www.hugomorceau.com;
```
			
supprimer les lignes dans **location / { }** et remplacer par :  
```
location / {
                proxy_pass http://localhost:3000;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }
```

vérifier que le fichier est bien écrit et que la config est bonne : 
```
nginx -t
```
**Rédémarer nginx**
```
systemctl restart nginx
```
**Si problème, apache empeche probablement nginx de se lancer, solution provisoire :**  
```
sudo fuser -k 80/tcp
sudo fuser -k 443/tcp
systemctl restart nginx 
```

**Installation du parefeu**
```
sudo apt-get install ufw
sudo ufw enable
sudo ufw status
ufw allow ssh
ufw allow http
ufw allow https
```

**Installation HTTPS**
```
snap install --classic certbot
sudo apt install certbot
sudo apt install certbot python3-certbot-nginx

certbot --nginx
	enter email adress
	agree
	do not share email adress
	enter
	
certbot renew --dry-run
```
**INSTALLATION POSTGRES**
```
sudo apt update
sudo apt install postgresql postgresql-contrib
```
