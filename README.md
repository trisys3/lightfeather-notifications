# Receive Notifications from Your Supervisor

This application is available directly from the command line, which means no fiddling around with servers!

If you know where you cloned the repo, just put that path into your browser. For example, say you are using Cygwin or MSYS/MinGW and ran `git clone git@github.com:trisys3/lightfeather-notifications.git /c/Users/me/lightfeather-notifications`. In this case, the URL would be `file:///C:/Users/me/lightfeather-notifications/index.html`.

This page works on all modern browsers. It WILL NOT work on Internet Explorer.

If you want to edit the code yourself, you need to install `npm`. I like to use `asdf` for this:

```
git clone git@github.com:asdf-vm/asdf.git ~/.asdf
cd ~/.asdf
git checkout "$(git describe --abbrev=0 --tags)"
. $HOME/.asdf/asdf.sh
asdf plugin add nodejs
asdf install nodejs latest
asdf local nodejs <version from previous command>
```

Then install the `npm` packages, e.g. `npm ci`. Finally, start webpack with `./webpack.config.mjs -- -w` to see your changes. Hot reloading is not set up, so you need to reload the browser to see changes.

If you made a simple change and want to see how it affected the page without starting a watch, run `./webpack.config.mjs` instead.
