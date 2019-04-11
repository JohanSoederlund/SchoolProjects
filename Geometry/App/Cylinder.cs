namespace App
{
     
    public class Cylinder : Shape3D
    {
        public Cylinder(double hdiameter, double vdiameter, double height) : base((ShapeType)3, new Ellipse(hdiameter, vdiameter), height){

        }
    }
}