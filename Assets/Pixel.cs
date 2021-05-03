using UnityEngine;
using UnityEngine.UI;

public class Pixel : MonoBehaviour
{
    public int pos;
    public Color clr;
    public Sprite highlightImg;
    Image selfImg;

    private void Start()
    {
        selfImg = GetComponent<Image>();
    }
    public void PointerEnter() {
        selfImg.sprite = highlightImg;
   }

    public void PointerExit() {
        selfImg.sprite = null;
     }
}
