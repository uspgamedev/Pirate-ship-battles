#!/bin/bash

files="client/util.js client/players.js client/hud.js client/item.js client/login.js client/main.js client/game.js"
target=${@: -1}

if [ $# -lt 2 ]
then
    cat $files > $target
else
    files=${@:1:$(($#-1))}
    cat $files > $target
fi

files=$(sed 's/\//\\\//g' <<< $files)

files=($files)

target=$(sed 's/\//\\\//g' <<< $target)
target=($target)

sed -i 's/'$files'/'$target'/' index.html

i=$(( 1 ))
while [ $i -lt ${#files[@]} ]
do
    a=${files[$i]}
    sed -i '/'$a'/d' index.html
    i=$((i+1))
done
