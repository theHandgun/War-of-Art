# War-of-Art (Placeholder Name)
An online painting and guessing game similiar to gartic.io made with Javascript using Phaser 3 with Express and Socket.io on server.

## Public Lobby
Players join a public lobby (there is only 1 server support for testing purposes for now) and the first person to join the lobby becomes the host. 
Until the game is started by the host, players can freely draw on their private canvas with color support.

### Algorithm of Drawing
I had a few problems with drawing.

First problem was how was I be able to network all these dots? Sure, I can save every point in an array and send the array to the server every X miliseconds but since the user
will have at least 60 fps therefore, there would be 60 points to send to the server even if the user was just holding left click.

Second problem was the nature of pointer speed being independent of the framerate. Which meant that if the mouse was too fast, it would (and did) create
many points through the path of mouse instead of a full line stroke.

First option came to my mind was creating a bitmap, a zone with thousands of pixels, It would solve the first problem by not sending data to server that had
same pixel colors in same location, therefore saving network data and on the solution of the second problem, i was going to do a raycast each frame starting from the
mouse position on last frame to mouse position on the current frame and fill up pixels on the way. Possible downside of this solution was performance concerns. Raycasting
through thousands of pixels would've neededd a lot of optimization therefore development time.

Second solution came to mind was drawing a line between last and current position of the mouse using graphics library of Phaser 3. This wasn't solving the first problem although
I've noticed that the data I was going to send will only consist of four numbers and a few small strings, many games send huge player data each frame with no problems so I
thought it was okay. It proved I was right, latency was very low on a test using a server from Europe.
