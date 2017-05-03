import json
file = open("longwords.txt")
arr = []
txt = file.readline()
while txt != "":
	arr.append(txt[:len(txt)-1])
	txt = file.readline()
son = json.dumps(arr)
print son