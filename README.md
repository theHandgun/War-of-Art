# War-of-Art (Placeholder Name)
An online painting and guessing game similiar to gartic.io made with Javascript using Phaser 3 with Express and Socket.io on server.

## Public Lobby
Players join a public lobby (there is only 1 server support for testing purposes for now) and the first person to join the lobby becomes the game manager. 
Players can freely draw on their private canvas with color support until the game is started by the game manager.

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

## Start of the game
When game starts, two random players will be choosen to battle. All players will see the avatar and name of the players on their screen. After that screen, choosen players
will be given a random word from a json file in server files and they will be asked to draw that word to canvas without writing any letters. Non-choosen players, spectators, are able to watch choosen players draw simultaneously on 2 smaller canvasses. While watching, spectators can guess on what the word choosen players are choosing. If they guessed
correctly, they will get points and it will be broadcasted on chat. If the guess is wrong, the guess will be printed on the chat window for all players to see. After drawing
phase is over, (currently 30 seconds) word will be revelaed to all and spectators will be given some time to vote on which player have drawn the best image of the world. More
votes a player has, more points the player will get.

### Algorithm of scaling canvases
Choosen players see a huge canvas with tools to illustrate the given word but spectators see two smaller canvases. Because I wanted to make drawings real time side to side I
had to scale two points sent from drawers to spectators' canvases. I thought it would be a complicated process, I've spent fair bit of time going through documentation of
Phaser 3 graphics library but wasn't able to find out what I wanted. So I had to create my own scaling algorithm, I thought I would days to solve this problem but I just came
up with a simple solution after doing some tests.
![canvas_scaling](https://user-images.githubusercontent.com/22753759/118721056-0912c500-b833-11eb-8a1d-a49f2a6aea55.png)
As you can see on the image, I just realized that only thing I had to do was find the x and y distance of points to the edges of the canvas, then multiply that distance with
ratio of two canvases and then change stroke size as well to make it look exactly the same. I never expected it to be that simple but I was able to find the solution and implement it in a few hours.

## Game loop continues
After voting is over, players are sent to the screen where they wait for the host to continue the game again. I have future plans of removing the need for a host to press continue button every round after doing some play tests.

