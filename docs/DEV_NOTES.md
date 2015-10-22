# Dev notes

*the drawing board...*


- Rework socket connectors so that they remain opened and that only a calculated pool of connections are opened between 2 services.

Example:

Server A --> Server B
Server A acts as server and B as client
Server B --> Server A
Server B sees an opened connection with Server A, uses it as a client.
-Relation stays the same

Pooling can be applied on a global level, per adapter, or per destination  

- Make a 'Friend' class for other services.

Example:

circles.add('expos', {});

//create friend
friends.add('youpie', {
	hostname: 'youpie.com',	//default: '0.0.0.0'
	connection: 'ipc',	
	port: 80,						//default: 80
	poolSize: 20,				//default: 1
	circles: ['expos']	//default: the id of the friend
});

//get named friend
friends('youpie')
//get named socket
.conversation('baseball')
//send message
.send('How\'s life since the expos?');

//get named circle
circles('expos')
//get named socket
.conversation('baseball')
//broadcast message
.send('We miss you :(');

//get named friend
friends('youpie')
//get named socket
.conversation('baseball')
//add listener
.on('message', function(data){
	//Check payload, rest is Kalm metadata about the calls
});

//Auto-named
var youpie = friends.add({
	keepAlive: false,
	hostname: 'youpie.com',
	connection: 'ipc'
});

youpie.conversation().message('don\'t reply to this.'');
//Ends after sending

circle > friend > conversation > message

//wrapper

{
	origin: {
		id: <manifest.id>,
		hostname: <hostname>,
		path: <path>
		port: <port>
		name: <manifest.name>
	},
	metadata: {
		server: <is_request_server>
		conversationId: <conversation_id>
		messageId: <message_id>
		keepalive: <friend_as_pool>
	},
	payload: <payload>
}


class Circle
	function friend(friendName, options)	//options can override defined parameters of <friend>
	function add(friend)
	function remove(friend)
	function on('adding')
	function on('removing')

class Friend
	function conversation(conversationName, options) //same as circle... gets or creates a conversation going

class Conversation
	function message(body, options) //sends the body to the other friend
	function end()
	function on('message')
	function on('connect')
	function on('disconnect')

class Message
	function reply(body, options)


	========================= NAMING

[circle]: ok
friend: [service], remote, host, server, 
conversation: session, [socket], 
[message]: ok

findOrCreate: resolve, get, find, prepare, 

friends.get()

-------------

CLI commands to dynamicaly manipulate services...?

kalm add service <name> <json>
kalm update service <name> <json>
kalm delete service <name>

"" ... to cômmunicate with a service

kalm message <name> <json>