# AJMAN LUXURY Deployment

## Requirements

- Node.js 18 or newer
- npm
- A server that supports Node.js apps

## Upload

Upload all project files except:

- `node_modules`
- `.git`

## Install

```bash
npm install --production
```

## Environment

Edit `.env` before running the site:

```env
PORT=3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-this-password
SESSION_SECRET=change-this-secret-to-a-long-random-value
```

## Run

```bash
npm start
```

The website will run on the configured port.

Admin panel:

```text
/admin/login
```

## Notes

- Product images are stored in `public/images/products`.
- Admin content changes are saved in `data/site-data.json`.
- If the server uses cPanel, Plesk, Passenger, or PM2, set `server.js` as the app entry file.
