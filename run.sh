#! /bin/bash
# one liner to run phantom js script with arguments from states.csv

for i in $( cat states.csv | jq '.[]' ); do

    # Make a dir for each state
    folder=$(echo "STATES/$i" | sed s/\"//g )
    echo $folder
    mkdir -p $folder

    phantomjs get_state_page.js  $( sed -e 's/^"//' -e 's/"$//' <<<"$i")

done

# Notes: These are the states that have issues when running. Most can be replace with their abbrevation. Example, Georgia would be GA.
# Probelm with GEORIGA url
# Probelm with HAWAII url
# Probelm with IOWA url
# Probelm with KANSAS url
# Probelm with KENTUCKY url
# Probelm with LOUISIANA url
# Probelm with NORTHCAROLINA url
# Probelm with NORTHDAKOTA url
# Probelm with PENNSYLVANIA url
# Probelm with RHODEISLAND url
# Probelm with SOUTHCAROLINA url
# Probelm with SOUTHDAKOTA url
# Probelm with TENNESSEE url
# Probelm with TEXAS url
# Probelm with VERMONT url
# Probelm with WESTVIRGINIA url
