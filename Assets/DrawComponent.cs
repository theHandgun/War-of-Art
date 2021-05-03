using UnityEngine;
using UnityEngine.UI;

public class DrawComponent : MonoBehaviour
{

    public int pixelAmount;
    public Tool toolOnUse = Tool.Pen;
    public Color pickedColor = Color.red;
    public GameObject PixelPrefab;
    bool isMouseOverBoard;


    Vector2 lastMousePos = Vector2.zero;

    private void Start()
    {
        for (int i = 0; i < pixelAmount; i++)
        {
            var pixel = Instantiate(PixelPrefab, transform);
            pixel.GetComponent<Pixel>().pos = i;
        }
    }


    private void Update()
    {
        if (Input.GetMouseButton(0) || Input.GetMouseButton(1))
        {
            if(lastMousePos == Vector2.zero)
            {
                lastMousePos = Input.mousePosition;
                return;
            }

            Vector2 curMousePos = Input.mousePosition;

            RaycastHit2D[] rays = Physics2D.LinecastAll(lastMousePos, curMousePos);
            foreach (var ray in rays)
            {
                ray.collider.GetComponent<Image>().color = Input.GetMouseButton(0) ? pickedColor : Color.white;
                // Might need to check tags if there will be other objects with colliders.
                /*if (ray.collider.tag == "Pixel")
                {
                    ray.collider.GetComponent<Image>().color = Input.GetMouseButton(0) ? pickedColor : Color.white;
                }*/
            }

            lastMousePos = curMousePos;
        }
        else
        {
            lastMousePos = Vector2.zero;
        }
    }

    public void CleanUp()
    {
        for (int i = 0; i < transform.childCount; i++)
        {
            transform.GetChild(i).GetComponent<Image>().color = Color.white;
        }
    }

    public void ChangeColor(string clr)
    {
        // Color code: RRR_GGG_BBB
        string[] colors = clr.Split('_');
        Color newClr = new Color(int.Parse(colors[0]), int.Parse(colors[1]), int.Parse(colors[2]));
        pickedColor = newClr;
    }
    

}

public enum Tool
{
    Pen = 0,
    Eraser = 1
}