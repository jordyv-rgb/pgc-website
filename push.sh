#!/bin/bash
cd "$(dirname "$0")"
rm -f .git/index.lock .git/HEAD.lock
git add assets/stock/
git commit -m "feat: add stock image assets"
git push origin master
