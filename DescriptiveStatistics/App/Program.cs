/*
 * <author> Johan Söderlund</author>
 * <version> 1.0</version>
 */

using System;
using System.IO;
using Newtonsoft.Json;

namespace App
{
    class Program
    {
        /*
         * <summary>Start point of the application</summary>
         * <param name="args"> Console line arguments</param>
         */
        static void Main(string[] args)
        {
            string path = "./data.json";
            int[] src = convertJsonToC(path);
            Statistics.DescriptiveStatistics(src);
            Console.WriteLine(Statistics.DescriptiveStatistics(src));

            
            int[] source = new int[]{4, 8, 2, 4, 5};
            int[] source2 = new int[]{4, 2, 6, 1, 3, 7, 5, 3, 7};
            int[] source3 = new int[]{5, 1, 1, 1, 3, -2, 2, 5, 7, 4, 5, 16};
            Console.WriteLine("\n" + Statistics.DescriptiveStatistics(source));
            Console.WriteLine("\n" + Statistics.DescriptiveStatistics(source2));
            Console.WriteLine("\n" + Statistics.DescriptiveStatistics(source3));

            /* Test code
            Console.WriteLine("\nNull test & empty test");
            int[] sourceNull = null;
            Statistics.DescriptiveStatistics(sourceNull);
            int[] sourceEmpty = {};
            Statistics.DescriptiveStatistics(sourceEmpty);
             */
        }
        /*
         * <summary>Converts data from a Json file into C# object</summary>
         * <param name="path"> String with relative path to the Json file.</param>
         */
        static int[] convertJsonToC(string path){
            if(File.Exists(path))
            {
                try {
                    using (StreamReader file = File.OpenText(@"data.json"))
                {
                    JsonSerializer serializer = new JsonSerializer();
                    int[] src = (int[])serializer.Deserialize(file, typeof(int[]));
                    return src;
                }
                } catch (Exception e) {
                    Console.WriteLine("Exception caught.", e);
                    return null;
                }
            }else {
                return null;
            }
        }
    }
}
