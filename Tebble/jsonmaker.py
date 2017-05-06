import json
file = open("dictionary.txt")
arr = []
txt = file.readline().upper()
while txt != "":
	arr.append(txt[:len(txt)-1])
	txt = file.readline().upper()
son = json.dumps(arr)
print son