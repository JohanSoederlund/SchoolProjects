namespace App
{
     
    public class Sphere : Shape3D
    {
        public Sphere(double diameter) : base((ShapeType)4, new Ellipse(diameter), diameter){
            if (diameter <= 0)
            {
                throw new System.ArgumentOutOfRangeException("diameter", "Diameter must be greater than 0!");
            }
            Diameter = diameter;
        }

        public double Diameter {get; private set;}

        public override double MantelArea() {
            return _baseShape.Area * 4d; 
        }
        public override double TotalSurfaceArea() {
            return _baseShape.Area * 4d;
        }
        public override double Volume() {
            return (4d/3d) * _baseShape.Area * (_baseShape.Length()/2d);
        }
    }
}