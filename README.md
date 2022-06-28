# Phrasee offline task

This is an Express api writen in typescript

It has 3 endpoints:
 - `/post/:id` (GET)
 - `/create` (POST)
 - `/read/:id` (POST)

For the create endpoint please add a `userid` to the header of the request.

The request should come in the following formats:

### **Like:**
```json
{
	"type": "Like",
	"postId": "<postId>"
}
```

### **Comment:**
```json
{
	"type": "Comment",
	"postId": "<postId>",
    "comment": "<comment>"
}
```

The data in this project is not persistent since this configuration doesn't reflect a real world scenario.

Use `npm start` to run the project in your machine.
