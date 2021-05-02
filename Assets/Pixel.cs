using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Pixel : MonoBehaviour
{
    public int pos;
    public Color clr;
    public Sprite highlightImg;
    Image selfImg;
    bool isPointerInside;

    private void Start()
    {
        selfImg = GetComponent<Image>();
    }
    public void PointerEnter() {
        isPointerInside = true;
        selfImg.sprite = highlightImg;
   }

    public void PointerExit() {
        isPointerInside = false;
        selfImg.sprite = null;
     }
}
