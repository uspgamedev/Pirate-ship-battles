#!/usr/bin/env python3

import subprocess
import sys
import re

def concat_file(files, target) :
	subprocess.call(["cat " + files + " > " + target], shell=True)
	subprocess.call(["rm " + files], shell=True)

#Only works if there is inly one / in the names of the files.
def replace(files, target) :
	if ("/" in target) :
			temp = target.index("/")
			target = target[: temp] + "\\" + target[temp :]
	
	names = files.split()
	for i in range(len(names)) :
		if ("/" in names[i]) :
			temp = names[i].index("/")
			names[i] = names[i][: temp] + "\\" + names[i][temp :]
		
		if (i == 0) :
			subprocess.call(["sed -i 's/" + names[0] + "/" + target + "/' index.html"], shell=True)
		else :
			subprocess.call(["sed -i '/" + names[i] + "/d' index.html"], shell=True)


files = "client/util.js client/players.js client/hud.js client/item.js client/login.js client/main.js client/game.js"

pattern = re.compile("^[H, h]([e,E][L, l][P, p])?")

if (len(sys.argv) == 1) :
	print("No arguments given, run with the \"help\" command to find out how to use the sricpt.")
	sys.exit(1)

elif (pattern.match(sys.argv[1])) :
	print("Usage:   1- input_0 ... input_n output")
	print("         2- output")
	print("         .js required at the end of file.")
	print("         Second method will use a hardcoded list of files.")
	print("         The files given as input WILL be deleted.")
	sys.exit(0)

elif (len(sys.argv) > 2) :
	files = []
	for i in range(1, len(sys.argv) - 1) :
		files += (sys.argv[i] + " ")

target = sys.argv[-1]

concat_file(files, target)
replace(files, target)

