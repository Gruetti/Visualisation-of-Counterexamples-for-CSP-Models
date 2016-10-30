'''
The MIT License (MIT)
Copyright (c) 2013 Dave P.
'''

import signal
import sys
import ssl
from SimpleWebSocketServer import WebSocket, SimpleWebSocketServer, SimpleSSLWebSocketServer
from optparse import OptionParser
import json

class Counterexample(WebSocket):
    
    def handleMessage(self):
        pass
    
    def handleConnected(self):
        self.sendMessage(json.dumps({
  "name": "TRACE",
  "nodes": [{
      "data": { "id": "1", "acc_evt": ["a","b","c","d"], "ref_evt":[]}, "classes": "root_spec"
    },
    {
      "data": { "id": "2", "acc_evt": ["b","c","d"], "ref_evt":["a"]}, "classes": "spec"
    },
    {
      "data": { "id": "3", "acc_evt": ["a","b","d"], "ref_evt":["c"]}, "classes": "spec_end"
    },
    {
      "data": { "id": "1_", "acc_evt": ["a"], "ref_evt":["b","c","d"]}, "classes": "root_imp"
    },
    {
      "data": { "id": "2_", "acc_evt": ["a","b"], "ref_evt":["c","d"]}, "classes": "imp"
    },
  {
      "data": { "id": "3_", "acc_evt": ["c"], "ref_evt":["a","b","d"]}, "classes": "imp"
    },
    {
      "data": { "id": "4_", "acc_evt": [], "ref_evt":[]}, "classes": "imp_end"
    }],
    "edges": [{ 
      "data": { "id": "a", "source": "1", "target": "2", "label": "a"}, "classes": "spec"
    },
  { 
      "data": { "id": "b", "source": "2", "target": "3", "label": "b"}, "classes": "spec"
    },
  { 
      "data": { "id": "a_", "source": "1_", "target": "2_", "label": "a"}, "classes": "imp"
    },
    { 
      "data": { "id": "b_", "source": "2_", "target": "3_", "label": "b"}, "classes": "imp"
    },
  { 
      "data": { "id": "c_", "source": "3_", "target": "4_", "label": "c"}, "classes": "imp"
    }]
}))
        
    def handleClose(self):
        pass

class SimpleEcho(WebSocket):

   def handleMessage(self):
      self.sendMessage(self.data)

   def handleConnected(self):
      pass

   def handleClose(self):
      pass

clients = []
class SimpleChat(WebSocket):

   def handleMessage(self):
      for client in clients:
         if client != self:
            client.sendMessage(self.address[0] + u' - ' + self.data)

   def handleConnected(self):
      print (self.address, 'connected')
      for client in clients:
         client.sendMessage(self.address[0] + u' - connected')
      clients.append(self)

   def handleClose(self):
      clients.remove(self)
      print (self.address, 'closed')
      for client in clients:
         client.sendMessage(self.address[0] + u' - disconnected')


if __name__ == "__main__":

   parser = OptionParser(usage="usage: %prog [options]", version="%prog 1.0")
   parser.add_option("--host", default='', type='string', action="store", dest="host", help="hostname (localhost)")
   parser.add_option("--port", default=8000, type='int', action="store", dest="port", help="port (8000)")
   parser.add_option("--example", default='echo', type='string', action="store", dest="example", help="echo, chat")
   parser.add_option("--ssl", default=0, type='int', action="store", dest="ssl", help="ssl (1: on, 0: off (default))")
   parser.add_option("--cert", default='./cert.pem', type='string', action="store", dest="cert", help="cert (./cert.pem)")
   parser.add_option("--ver", default=ssl.PROTOCOL_TLSv1, type=int, action="store", dest="ver", help="ssl version")
   parser.add_option("--counterexample", default='false', type='string', action='store', dest="counterexample")

   (options, args) = parser.parse_args()

   cls = SimpleEcho
   if options.example == 'chat':
      cls = SimpleChat

   if options.counterexample=='true':
      cls = Counterexample

    
   if options.ssl == 1:
      server = SimpleSSLWebSocketServer(options.host, options.port, cls, options.cert, options.cert, version=options.ver)
   else:
      server = SimpleWebSocketServer(options.host, options.port, cls)

   def close_sig_handler(signal, frame):
      server.close()
      sys.exit()

   signal.signal(signal.SIGINT, close_sig_handler)

   server.serveforever()
