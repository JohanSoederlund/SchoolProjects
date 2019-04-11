namespace App
{
     
    public class Cuboid : Shape3D
    {
        public Cuboid(double length, double width, double height) : base((ShapeType)2, new Rectangle(length, width), height){

        }
    }
}