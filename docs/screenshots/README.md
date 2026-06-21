# Screenshots

PNG captures for the main README live here. To refresh them locally (with `pnpm dev` running on port 3000):

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT="$(git rev-parse --show-toplevel)/docs/screenshots"
"$CHROME" --headless=new --window-size=1280,800 --screenshot="$OUT/marketing.png" "http://127.0.0.1:3000/welcome"
"$CHROME" --headless=new --window-size=1280,800 --screenshot="$OUT/login.png" "http://127.0.0.1:3000/login"
"$CHROME" --headless=new --window-size=1280,800 --screenshot="$OUT/register.png" "http://127.0.0.1:3000/register"
```

Adjust the Chrome path on Linux or Windows as needed.

`stats.png` is behind auth, so the headless one-liner only captures the login
redirect. Capture it while signed in (drive a browser that already holds a
session cookie) at the same `1280x800` size against `/stats`.
