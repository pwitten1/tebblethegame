#!/bin/bash
awk '{
if(length($0) > 2){
	print $0
}
}' $1