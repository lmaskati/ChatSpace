
const socket = io.connect();

var nickname;

function clear(){
    document.getElementById("messageField").clearField()
}

// fired when the page has loaded
$(document).ready(function(){
    // handle incoming messages
    var feedback = document.getElementById("feedback");
    var messagefield = document.getElementById("messageField");
    const messageStuff = $('#messageForm').submit(sendMessage);


    socket.on('message', function(nickname, message, time){

        feedback.innerHTML = ""
        // display a newly-arrived message

        let e = document.getElementById("what")

        let post = document.createElement("div");
        post.id = "mypost"

                //get the username

                let uname = document.createElement("p");
                uname.id = "text"

                uname.innerHTML = "Username: " + nickname

                //get the time

                let thetime = document.createElement("span");
                thetime.id = "thetime"

                thetime.innerHTML = time


                //get the message

                let themessage = document.createElement("p");
                themessage.id = "text"

                themessage.innerHTML = nickname + " says: '" + message +"'"



                post.appendChild(thetime)
                //post.appendChild(uname)
                post.appendChild(themessage)


                e.appendChild(post)

            });

    // handle room membership changes
    // you may want to consider having separate handlers for members joining, leaving, and changing their nickname
    //NEWCHANGE
    socket.on('newMember', function(newmember){
        document.getElementById('update').innerHTML = "New member in the chatroom! Meet " + newmember + "!"
    })

    socket.on('newName', function(newname){
        document.getElementById('update').innerHTML = "A member has decided to adopt a new username. Say hi to " + newname + "!"
    })

    socket.on('memberLeft', function(){
        document.getElementById('update').innerHTML = "A member has left the chatroom."
    })

    socket.on('membershipChanged', function(members){
        // display the new member list
        console.log("HI")
        console.log(members)

        memstring = ""

        for (let i=0; i<members.length; i++) {

            if (i == members.length - 1) {
                memstring += members[i]
            } else {
                memstring += members[i] + ", "
            }
        }

        console.log(memstring)

        document.getElementById('listofusers').innerHTML = "The users currently in this chatroom are: " + memstring

    });

    // get the nickname
    let currnickname = prompt('Enter a nickname:');
    nickname = currnickname

    document.getElementById('output').innerHTML = "Hi " + nickname + "! Post a message:";


    // join the room
    socket.emit('join', meta('roomName'), nickname, function(messages, allclients){
        // process the list of messages the server sent back
        console.log(messages)
        console.log(allclients)


        let e = document.getElementById("what")

        e.innerHTML = ""

        for (let i=0; i<messages.length; i++) {

            let post = document.createElement("div");
            post.id = "mypost"

                //get the username

                let uname = document.createElement("p");
                uname.id = "text"

                uname.innerHTML = "Username: " + messages[i].nickname

                //get the time

                let time = document.createElement("span");
                time.id = "thetime"

                time.innerHTML = messages[i].Time


                //get the message

                let message = document.createElement("p");
                message.id = "text"

                message.innerHTML = messages[i].nickname + " says: '" + messages[i].message +"'"



                post.appendChild(time)
                //post.appendChild(uname)
                post.appendChild(message)


                e.appendChild(post)

            };



        });

    function sendMessage(event) {
        console.log("start");
    // prevent the page from redirecting
    event.preventDefault();

    var myMessage = document.getElementById("messageField").value
    document.getElementById('messageField').value = ''
    var myUser = nickname;
    var myRoom = meta('roomName');
    var myTime =  Date(Date.now()).toString()


    console.log(myUser)

    socket.emit('message', {m1: myMessage, m2: myUser, m3: myRoom, m4: myTime})

    }

    messagefield.addEventListener('keydown', function(){
        socket.emit('typing', nickname)
    })

    messagefield.addEventListener('keyup', function(){
        socket.emit('stoptyping', nickname)
    })

    socket.on('typing', function(data){
        feedback.innerHTML = data + " is typing..."
    })


});


      function meta(name) {
        const tag = document.querySelector('meta[name=' + name + ']');
        if (tag != null)
            return tag.content;
        return '';
    }

    function changeName() {
        let newnickname = prompt('Enter a nickname:');
    nickname = newnickname
    console.log(nickname)
    document.getElementById('output').innerHTML = "Hi " + nickname + "! Post a message:";
    socket.emit('membershipChanged', nickname)


    }
