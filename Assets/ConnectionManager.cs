using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using UnityEngine;

public class ConnectionManager : MonoBehaviour
{

    TcpListener listener;
    List<TcpClient> clients;

    public void HostGame(string nick, int port)
    {
        try
        {
            listener = new TcpListener(IPAddress.Any, port);
            listener.Start();

            Thread t = new Thread(HostFindClients);
        }
        catch (Exception e)
        {
            print(e.ToString());
        }
    }

    async void HostFindClients()
    {
        while(true)
        {
            TcpClient client =  await listener.AcceptTcpClientAsync();

            Thread t = new Thread(() =>
            {
                clients.Add(client);
                
                while (client.Connected)
                {
                    Listen(client);
                }

                clients.Remove(client);
                print("Client lost connection.");
            });

            t.Start();
            t.IsBackground = true;
        }
    }


    public void TryJoinGame(string nick, string ip, int port)
    {
        try
        {
            TcpClient clientTcp = new TcpClient(ip, port);
            Thread t = new Thread(() => Listen(clientTcp));
        }
        catch(Exception e)
        {
            print(e.ToString());
        }
    }

    public void Listen(TcpClient client)
    {
        while (true)
        {
            StreamReader networkStream = new StreamReader(client.GetStream());

            string msg = networkStream.ReadLine();

            switch(msg){
                case "1":
                    print("Connection alive, recieved '1'.");
                    break;
            }
        }
    }

}
