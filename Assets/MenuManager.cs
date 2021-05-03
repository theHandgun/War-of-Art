using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using System.Net;

public class MenuManager : MonoBehaviour
{
    public ConnectionManager cm;

    public TMP_InputField NickBoxHost;
    public TMP_InputField PortHost;

    public TMP_InputField NickBoxClient;
    public TMP_InputField IPClient;
    public TMP_InputField PortClient;

    public void JoinGame()
    {
        if(NickBoxClient.text.Length < 3)
        {
            print("Add more characters to nickname.");
            return;
        }

        if(PortClient.text.Length < 4)
        {
            print("Add more numbers to the port.");
            return;
        }

        try
        {
            var v = IPAddress.Parse(IPClient.text);
        }
        catch
        {
            print("Please enter a valid IP adress.");
            return;
        }

        cm.TryJoinGame(NickBoxClient.text, IPClient.text, int.Parse(PortClient.text));
    }

    public void HostGame()
    {
        if (NickBoxHost.text.Length < 3)
        {
            print("Add more characters to nickname.");
            return;
        }

        if (PortHost.text.Length < 4)
        {
            print("Add more numbers to the port.");
            return;
        }

        cm.HostGame(NickBoxHost.text, int.Parse(PortHost.text));

    }
}
