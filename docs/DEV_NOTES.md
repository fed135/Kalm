Dev notes:

 - Connections/ connectors need to be better packaged so that it will allow custom connections.
 (DB connectors, etc.)

 need a request module: an interface for -in
 need a response module: an interface for -out

in : {
	hostname,
	port,
	method,
	(path/event),
	params,
	payload,
	connector,
	headers,
	authKey,
	id,
	status
	<prototype>
	send
	on
}

out: {
	origin,
	method,
	(path/event),
	params,
	payload,
	connector,
	headers,
	authKey,
	id,
	status
	<prototype>
	reply
	on
}

