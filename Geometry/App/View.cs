using System;
using System.Collections.Generic;
namespace App
{
    class View
    {
        public void PrintRules()
        {
            System.Console.WriteLine("Welcome to Shapes!\nShapes lets you contruct Shapes and then retrieve sorted statistics. "
            + "\nExampels\nRectangle\nEllipse\nCuboid\nCylinder\nSphere"
            + "\nTo get the rules enter 1, to retrieve statistics enter 2 and enter 0 to exit.");
        }
        
        public string GetUserInput()
        {
            System.Console.WriteLine("Enter what type shape you like to construct:\n");
            return System.Console.ReadLine();
        }
        public void PrintStatistics(List<List<Shape>> listOfShapes)
        {
            if (listOfShapes == null || listOfShapes.Count == 0) 
            {
                System.Console.WriteLine("No shapes to print. Please construct some first.");
                return;
            }
            System.Console.WriteLine("Figur \t\t Längd\t Bredd \t Omkrets \t Area");
            for (int i = 0; i < listOfShapes.Count; i++)
            {   
                if (i == 2)
                {
                    if (listOfShapes[2].Count != 0 || listOfShapes[3].Count != 0 || listOfShapes[4].Count != 0) 
                    {
                        System.Console.WriteLine("Figur \t\t Längd\t Bredd \t Höjd \t Mantelarea \t Begräns.area \t Volym");
                    }
                }
                foreach (var item in listOfShapes[i])
                {
                    switch (item.ShapeType)
                    {
                        case ShapeType.Ellipse:
                            Console.WriteLine(((Ellipse)item).ToString("R"));
                            break;
                        case ShapeType.Rectangle:
                            Console.WriteLine(((Rectangle)item).ToString("R"));
                            break;
                        case ShapeType.Cylinder:
                            Console.WriteLine(((Cylinder)item).ToString("R"));
                            break;
                        case ShapeType.Cuboid:
                            Console.WriteLine(((Cuboid)item).ToString("R"));
                            break;
                        case ShapeType.Sphere:
                            Console.WriteLine(((Sphere)item).ToString("R"));
                            break;
                        default:
                            Console.WriteLine("Not a shape");
                            break;
                    }
                }
            }
        }

            

    }

}