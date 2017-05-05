#!/bin/bash
awk '{
if(length($0) > 2 && length($0) < 7){
	print $0
}
}' $1