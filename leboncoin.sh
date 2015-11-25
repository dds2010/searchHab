#!/bin/sh


downloadseloger=true
url="http://ws.seloger.com/search.xml?ci=310004,310048,310113,310113,310161,310162,310169,310254,310340,310429,310446&pxmin=200000&pxmax=350000&idtt=2&SEARCHpg=1&idtypebien=2&tri=d_dt_crea&getdtcreationmax=1"
url2="http://ws.seloger.com/search.xml?ci=310004,310048,310113,310113,310161,310162,310169,310254,310340,310429,310446&pxmin=200000&pxmax=350000&idtt=2&SEARCHpg=2&idtypebien=2&tri=d_dt_crea&getdtcreationmax=1"
url3="http://ws.seloger.com/search.xml?ci=310004,310048,310113,310113,310161,310162,310169,310254,310340,310429,310446&pxmin=200000&pxmax=350000&idtt=2&SEARCHpg=3&idtypebien=2&tri=d_dt_crea&getdtcreationmax=1"
url4="http://ws.seloger.com/search.xml?ci=310004,310048,310113,310113,310161,310162,310169,310254,310340,310429,310446&pxmin=200000&pxmax=350000&idtt=2&SEARCHpg=4&idtypebien=2&tri=d_dt_crea&getdtcreationmax=1"


startDate="Le 21 Novembre 2015 00:00."


output=result_23_11_2015.json
mkdir temp

echo "" > $output
cat templates/header >>$output

if [ $downloadseloger = true ]
	then
	curl $url > temp/search.xml
	curl $url2 > temp/search2.xml
	curl $url3 > temp/search3.xml
	curl $url4 > temp/search4.xml

	sed -i '2i<?xml-stylesheet href=\"selogerToJson.xsl\" type=\"text/xsl\"?\>' temp/search.xml
	sed -i '2i<?xml-stylesheet href=\"selogerToJson.xsl\" type=\"text/xsl\"?\>' temp/search2.xml
	sed -i '2i<?xml-stylesheet href=\"selogerToJson.xsl\" type=\"text/xsl\"?\>' temp/search3.xml
	sed -i '2i<?xml-stylesheet href=\"selogerToJson.xsl\" type=\"text/xsl\"?\>' temp/search4.xml


fi

python find_seloger.py temp/search.xml "$startDate"  >> $output
echo ",">>$output
python find_seloger.py temp/search2.xml "$startDate" >>$output
echo ",">>$output
python find_seloger.py temp/search3.xml "$startDate" >>$output
echo ",">>$output
python find_seloger.py temp/search4.xml "$startDate" >>$output
echo ",">>$output



url="http://www.leboncoin.fr/ventes_immobilieres/offres/midi_pyrenees/haute_garonne/?f=a&th=1&ps=8&pe=14&ret=1&location=Castanet-Tolosan%2031320"
url1="http://www.leboncoin.fr/ventes_immobilieres/offres/midi_pyrenees/?f=a&th=1&ps=8&pe=14&sqs=11&ros=4&ret=1&location=Castanet-Tolosan%2031320%2CSaint-Orens-de-Gameville%2031650%2CEscalquens%2031750"
url2="http://www.leboncoin.fr/ventes_immobilieres/offres/midi_pyrenees/?f=a&th=1&ps=8&pe=14&sqs=11&ros=4&ret=1&location=Donneville%2031450%2CDeyme%2031450%2CPompertuzat%2031450"
url3="http://www.leboncoin.fr/ventes_immobilieres/offres/midi_pyrenees/?f=a&th=1&ps=8&pe=14&sqs=11&ros=4&ret=1&location=Bazi%E8ge%2031450%2CAyguesvives%2031450%2CLab%E8ge%2031670"

arrayurl=( $url1 $url2 $url3 )

download=true


for url in "${arrayurl[@]}"
do
	echo $url


	if [ $download = true ]
		then
		curl $url > temp/firstPage.html
	fi





	gawk 'match($0, /(http:\/\/www\.leboncoin.fr\/ventes_immobilieres\/offres.*o=[0-9]*.*)"/, a) {print a[1]}'  temp/firstPage.html > offres.list

	echo $url >> offres.list
	sort -u offres.list > offres3.list

	sed "s/\&amp;/\&/g"  offres3.list >  offres2.list

	counter=0
	cat offres2.list | while read line
	do
		counter=$((counter+1))

		counteroffre=0
		echo "curl $line > temp/res_$counter.txt"
		if [ $download = true ]
			then
			curl $line > temp/res_$counter.txt
		fi
		#href="http://www.leboncoin.fr/ventes_immobilieres/882729568.htm?ca=16_s" title="Grange sur 2 niveaux"
		gawk 'match($0, /http:\/\/www\.leboncoin.fr\/ventes_immobilieres\/[0-9]*.htm.*ca=16_s/, a) {print a[0]}'  temp/res_$counter.txt > temp/res_$counter.list
		mkdir temp/res_$counter
		cat temp/res_$counter.list | while read lineoffre
		do
			counteroffre=$((counteroffre+1))
			if [ $download = true ]
				then
				curl $lineoffre > temp/res_$counter/res_$counteroffre.html
			fi
			#echo "<tr>">>$output
			#echo "<td><a href='$lineoffre'>$lineoffre</a></td>" >>$output
			#echo "{">>$output
			#echo "\"url\":\"$lineoffre\"," >>$output
			python find.py temp/res_$counter/res_$counteroffre.html "$startDate" $lineoffre>>$output
			#echo ",">>$output
			#echo "</tr>">>$output
			#echo "},">>$output
		done
	done

	
done


cat templates/footer >>$output
