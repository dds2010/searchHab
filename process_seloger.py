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



filename_reference=sys.argv[3]

textfile = open(filename, 'r')
filetext = textfile.read()
textfile.close()


textfile = open(filename_reference, 'r')
filetext_ref = textfile.read()
textfile.close()


olddate=datetime.datetime.strptime(datestart, "Le %d %B %Y %H:%M.")
#print(filetext)
#t=json.loads (filetext)
t=json.loads(filetext.decode("utf8"))
#t=json_decode(filetext.decode("utf8"))

#print(filetext_ref)
ref=json.loads(filetext_ref.decode("utf8"))
#print(ref)
#print(len(t["test"]))
#print(t["test"][0]["city"])

start=""
for variable in t["test"] :
  datemaj=variable["dateMaj"]
  #print datemaj
  if(datemaj.startswith( 'le' )):
    date=datemaj.strip().split('&agrave;')[0].title().replace(' 1 ',' 01 ').replace(' 2 ',' 02 ').replace(' 3 ',' 03 ').replace(' 4 ',' 04 ').replace(' 5 ',' 05 ').replace(' 6 ',' 06 ').replace(' 7 ',' 07 ').replace(' 8 ',' 08 ').replace(' 9 ',' 09 ');
    date=date+" 2015 "+datemaj.strip().split('&agrave;')[1]
    dt=datetime.datetime.strptime(date, "Le %d %B %Y %H:%M.")
  else:
    dt=datetime.datetime.strptime(datemaj, "%Y-%m-%dT%H:%M:%S")

  



  if(dt>olddate):
    
    exist=False
    message=""
    for old_res in ref["test"] :
      #print(old_res["city"])
      if(old_res["url"]==variable["url"] and old_res["prix"]==variable["prix"] and variable["dateMaj"]!=old_res["dateMaj"]):
        exist=True
        message=variable["surface"]+" "+variable["city"]+" "+variable["titre"]+"("+variable["dateMaj"]+" "+variable["prix"] +") doublon m url de "+old_res["titre"]+"("+old_res["dateMaj"]+" "+old_res["prix"]+")"
      elif(old_res["url"]==variable["url"]):
        exist=True
        message=variable["surface"]+" "+variable["city"]+" "+variable["titre"]+"("+variable["dateMaj"]+" "+variable["prix"] +") doublon m url  prix diff de "+old_res["titre"]+"("+old_res["dateMaj"]+" "+old_res["prix"]+")"
      elif(old_res["city"]==variable["city"] and old_res["prix"]==variable["prix"] and old_res["surface"]==variable["surface"] and variable["dateMaj"]!=old_res["dateMaj"]):
        exist=True
        message=variable["surface"]+" "+variable["city"]+" "+variable["titre"]+"("+variable["dateMaj"]+" "+variable["prix"] +") doublon de "+old_res["titre"]+"("+old_res["dateMaj"]+" "+old_res["prix"]+")"

      elif(old_res["city"]==variable["city"] and old_res["titre"]==variable["titre"] and old_res["surface"]==variable["surface"] and variable["dateMaj"]!=old_res["dateMaj"]):
        exist=True
        message=variable["surface"]+" "+variable["city"]+" "+variable["titre"]+"("+variable["dateMaj"]+" "+variable["prix"] +") doublon et changement de prix de "+old_res["titre"]+"("+old_res["dateMaj"]+" "+old_res["prix"]+")"

    if(exist==False):
      print(start)
      start=","  
      print(json.dumps(variable, ensure_ascii=False).encode("utf8"))
    #else:
    #  print message.encode("utf8")
  


