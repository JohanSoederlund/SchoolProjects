using System;
using System.Collections.Generic;
using System.Collections;
using System.Linq;
namespace App
{
    class Program
    {
        static void Main(string[] args)
        {
            try 
            {
                Controller controller = new Controller();
                //TestShapes();
                //TestShapesNegativeValues();
            } catch(Exception e)
            {
                Console.Error.WriteLine(e);
            }
            
        }
        public static void TestShapes()
        {
            string str = null;
            Console.WriteLine("Hello World!");
            Ellipse ellipse2 = new Ellipse(5.7, 34.5);
            //TODO : Unhandled Exception: System.NullReferenceException: Object reference not set to an instance of an object.
            //Console.WriteLine(ellipse2.ToString(null));
            //Console.WriteLine(ellipse2.ToString(str));
            Console.WriteLine(ellipse2.ToString("R"));
            Console.WriteLine(ellipse2.ToString("G"));
            Console.WriteLine("\n");

            Rectangle rec = new Rectangle(5.7, 34.5);
            Console.WriteLine(rec.ToString("R"));
            Console.WriteLine(rec.ToString("G"));
            Console.WriteLine("\n");

            Cuboid cub = new Cuboid(29.6, 29.6, 29.6);
            Console.WriteLine(cub.ToString("R"));
            Console.WriteLine(cub.ToString("G"));
            Console.WriteLine("\n");

            Cylinder cyl = new Cylinder(29.6, 29.6, 29.6);
            Console.WriteLine(cyl.ToString("R"));
            Console.WriteLine(cyl.ToString("G"));
            Console.WriteLine("\n");

            Sphere sphere = new Sphere(29.6);
            //Test bad value
            //Console.WriteLine(sphere.ToString("BADVALUE"));
            Console.WriteLine(sphere.ToString("R"));
            Console.WriteLine(sphere.ToString("G"));
            Console.WriteLine("\n");
        }
        public static void TestShapesNegativeValues()
        {
            Ellipse ellipse2 = new Ellipse(0, 0);
            Rectangle rec = new Rectangle(0, 0);
            Cuboid cub = new Cuboid(0,0,0);
            Cylinder cyl = new Cylinder(0,0,0);
            Sphere sphere = new Sphere(0);
        }
    }
}
