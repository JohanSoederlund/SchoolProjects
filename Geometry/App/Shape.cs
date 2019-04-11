

namespace App
{
    public abstract class Shape
    {
        public ShapeType ShapeType{ get; private set; }
        protected Shape(ShapeType shapeType)
        {
            if (shapeType == ShapeType.Cuboid || shapeType == ShapeType.Cylinder || shapeType ==  ShapeType.Sphere)
            {
                Is3D = true;
            } else 
            {
                Is3D = false;
            }
            ShapeType = shapeType;
        }

        public readonly bool Is3D;

        public abstract override string ToString();
    }
}