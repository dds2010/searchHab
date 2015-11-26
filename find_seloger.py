import re
import sys
import json
import tokenize
import token
from StringIO import StringIO
import datetime
import locale

import xml.etree.ElementTree as ET


locale.setlocale(locale.LC_ALL, 'fr_FR')

filename=sys.argv[1]
datestart=sys.argv[2]



olddate=datetime.datetime.strptime(datestart, "Le %d %B %Y %H:%M.")

tree = ET.parse(filename)
root = tree.getroot()
i=0
for neighbor in root.iter('annonce'):

	idTypeTransaction=neighbor.find('idTypeTransaction').text
	idSousTypeBien="0"
	if(neighbor.find('idSousTypeBien') is not None):
		idSousTypeBien=neighbor.find('idSousTypeBien').text
	datemaj=neighbor.find('dtFraicheur').text
	dt=datetime.datetime.strptime(datemaj, "%Y-%m-%dT%H:%M:%S")
	#
	
	if(dt>olddate and idSousTypeBien!="69" and idTypeTransaction=="2"):
	#if(True):
		if(i>0):
			print ","
		i=i+1
		print ('{')
		print ('\"source\":\"seloger\",')
		print '\"city\":\"'+neighbor.find('ville').text.encode('utf8')+"\","
		
		print '\"cp\":\"'+neighbor.find('cp').text+"\","
		print '\"codeInsee\":\"'+neighbor.find('codeInsee').text+"\","
		print '\"url\":\"'+neighbor.find('permaLien').text+"\","
		print '\"idAnnonce\":\"'+neighbor.find('idAnnonce').text+"\","
		print '\"idTiers\":\"'+neighbor.find('idTiers').text+"\","
		photos=neighbor.find('photos')
		if(len(photos)>0):
			print '\"image\":\"'+neighbor.find('photos')[0].find('stdUrl').text+"\","
		print '\"titre\":\"'+neighbor.find('titre').text.encode('utf8')+"\","
		print '\"idTypeTransaction\":\"'+idTypeTransaction+"\","
		print '\"idSousTypeBien\":\"'+idSousTypeBien+"\","
		print '\"libelle\":\"'+neighbor.find('libelle').text.encode('utf8')+"\","
		print('\"description\":\"'+neighbor.find('descriptif').text.encode('utf8').strip().replace('\n', ' ').replace('\'', ' ').replace("\"","")+"\",")
		print '\"prix\":\"'+neighbor.find('prix').text+"\","
		print '\"nbChambre\":\"'+neighbor.find('nbChambre').text+"\","
		print '\"pieces\":\"'+neighbor.find('nbPiece').text+"\","
		print '\"surface\":\"'+neighbor.find('surface').text+"\","
		print '\"dateMaj\":\"'+datemaj+"\","
		
		bilanConsoEnergie=neighbor.find('bilanConsoEnergie')
		consoEnergie=neighbor.find('consoEnergie')
		emissionGES=neighbor.find('emissionGES')
		bilanEmissionGES=neighbor.find('bilanEmissionGES')
		
		if(bilanConsoEnergie is not None):
			print '\"nrj\":\"'+bilanConsoEnergie.text.lower()+"\","
		if(consoEnergie is not None):
			print '\"consonrj\":\"'+consoEnergie.text+"\","
		if(emissionGES is not None):
			print '\"consoges\":\"'+emissionGES.text+"\","
		if(bilanEmissionGES is not None):
			print '\"ges\":\"'+bilanEmissionGES.text.lower()+"\","


		if(len(neighbor.find('anneeconstruct'))>0):
			print '\"anneeconstruct\":\"'+neighbor.find('anneeconstruct').text+"\","

		print '\"dateCrea\":\"'+neighbor.find('dtCreation').text+"\""
		if(len(photos)>0):
			photoList=""
			start=""
			for photo in photos :
				photoList+=start
				photoList+=photo.find('stdUrl').text
				start=","
			print ',\"images\":\"'+photoList+"\""
		print '}'

	