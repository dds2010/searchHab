import re
import sys
import json
import tokenize
import token
from StringIO import StringIO
import datetime
import locale
locale.setlocale(locale.LC_ALL, 'fr_FR')



def fixLazyJson (in_text):
  tokengen = tokenize.generate_tokens(StringIO(in_text).readline)

  result = []
  for tokid, tokval, _, _, _ in tokengen:
    # fix unquoted strings
    if (tokid == token.NAME):
      if tokval not in ['true', 'false', 'null', '-Infinity', 'Infinity', 'NaN']:
        tokid = token.STRING
        tokval = u'"%s"' % tokval

    # fix single-quoted strings
    elif (tokid == token.STRING):
      if tokval.startswith ("'"):
        tokval = u'"%s"' % tokval[1:-1].replace ('"', '\\"')

    # remove invalid commas
    elif (tokid == token.OP) and ((tokval == '}') or (tokval == ']')):
      if (len(result) > 0) and (result[-1][1] == ','):
        result.pop()

    # fix single-quoted strings
    elif (tokid == token.STRING):
      if tokval.startswith ("'"):
        tokval = u'"%s"' % tokval[1:-1].replace ('"', '\\"')

    result.append((tokid, tokval))

  return tokenize.untokenize(result)


import json

def json_decode (json_string, *args, **kwargs):
  try:
    json.loads (json_string, *args, **kwargs)
  except:
    json_string = fixLazyJson (json_string)
    return json.loads (json_string, *args, **kwargs)


filename=sys.argv[1]
datestart=sys.argv[2]
url=sys.argv[3]
#print sys.argv[1]
textfile = open(filename, 'r')
filetext = textfile.read()
textfile.close()


matches = re.findall("<div class=\"print-image1\">(.*?)</div", filetext,flags=re.DOTALL)

if(len(matches)>0):
  image=matches[0]
else:
  image=None



matches = re.findall("Mise en ligne(.*?)\n", filetext,flags=re.DOTALL)

infos=matches[0]

#print "<td>"+infos+"</td>"


date=infos.strip().split('&agrave;')[0].title().replace(' 1 ',' 01 ').replace(' 2 ',' 02 ').replace(' 3 ',' 03 ').replace(' 4 ',' 04 ').replace(' 5 ',' 05 ').replace(' 6 ',' 06 ').replace(' 7 ',' 07 ').replace(' 8 ',' 08 ').replace(' 9 ',' 09 ');
date=date+" 2015 "+infos.strip().split('&agrave;')[1]

#date=infos.strip().replace('&agrave;','').replace('le','').strip()

dt=datetime.datetime.strptime(date, "Le %d %B %Y %H:%M.")


olddate=datetime.datetime.strptime(datestart, "Le %d %B %Y %H:%M.")
if(dt>olddate):
  print "{"
  print "\"url\":\""+url+"\","
  print "\"dateMaj\":\""+infos.strip()+"\","

  if(image is not None):
    print "\"image\":\""+image.strip().replace('\"','\\\"')+"\","


  matches = re.findall("itemprop=\"description\">(.*?)</div", filetext,flags=re.DOTALL)

  description=matches[0]

  #print "<td>"+description+"</td>"
  print "\"description\":\""+description.decode('iso-8859-15').encode('utf8').strip().replace('\n', ' ').replace('\'', ' ').replace('\"','\\\"')+"\","
  matches = re.findall("utag_data =(.*?)</script", filetext,flags=re.DOTALL)

  infos=matches[0]


  #test=json.loads(infos)
  t=json_decode(infos)
  #print "<td>"+t["city"]+"</td>"
  #print "<td>"+t["prix"]+"</td>"
  #print "<td>"+t["titre"]+"</td>"
  #print "<td>"+t["surface"]+"</td>"
  #print "<td>"+t["pieces"]+"</td>"
  #print "<td>"+t["offres"]+"</td>"

  print "\"city\":\""+t["city"].decode('iso-8859-15').encode('utf8')+"\","
  print "\"prix\":\""+t["prix"]+"\","
  print "\"titre\":\""+t["titre"].decode('iso-8859-15').encode('utf8')+"\","
  print "\"surface\":\""+t["surface"]+"\","
  print "\"pieces\":\""+t["pieces"]+"\","
  if 'ges' in t:
    print "\"ges\":\""+t["ges"]+"\","
  if 'nrj' in t:
    print "\"nrj\":\""+t["nrj"]+"\","
  print "\"offres\":\""+t["offres"]+"\""
  


  #print "<td>"+infos+"</td>"

  matches = re.findall("itemprop=\"image\" content=\"(.*?)\"", filetext,flags=re.DOTALL)

  #infos=matches[0]

  #print "<td>"+infos+"</td>"





  matches = re.findall("<div class=\"print-image-other\">(.*?)</div", filetext,flags=re.DOTALL)

  if(len(matches)>0):
    infos=matches[0]

    #print "<td>"+infos+"</td>"
    print ",\"images\":\""+infos.strip().replace('\n', ' ').replace('\"','\\\"')+"\""
  print "},"
