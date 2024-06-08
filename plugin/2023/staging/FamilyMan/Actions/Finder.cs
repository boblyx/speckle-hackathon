using System;
using System.Diagnostics;
using Autodesk.Revit.UI;
using Autodesk.Revit.DB;
using Autodesk.Revit.DB.Analysis;
using Autodesk.Revit.UI.Selection;
using System.Collections.Generic;
using Autodesk.Revit.DB.Architecture;
using System.Linq;
using System.Text.Json;

namespace FamilyMan.Actions
{
    public class FamilySymbolInfo
    {
        public string uuid { get; set; }
        public string name { get; set; }
        public string ftype { get; set; }
        public int count { get; set; }
        //public string 
        public FamilySymbolInfo(string uuid, string name, string ftype, int count = 0) {
            this.uuid = uuid;
            this.name = name;
            this.ftype = ftype;
            this.count = count;
        }
    }
    class Finder
    {
        /// <summary>
        /// Returns JSON string of dict indexed by family categories
        /// </summary>
        /// <param name="app"></param>
        /// <returns></returns>
        public static string getFamilySymbols_Sort_Category(UIApplication app){
            Document doc = app.ActiveUIDocument.Document;
            Dictionary<string, Dictionary<string, FamilySymbolInfo>> familySymbolsDict = new Dictionary<string, Dictionary<string, FamilySymbolInfo>> { };
            //Dictionary<string, FamilySymbolInfo> fsis = new Dictionary<string, FamilySymbolInfo>();
            FilteredElementCollector fc = new FilteredElementCollector(doc);
            var symbols = fc.OfClass(typeof(FamilySymbol));
            foreach (FamilySymbol fs in fc)
            {
                if (!(familySymbolsDict.ContainsKey(fs.Category.Name))){
                    familySymbolsDict[fs.Category.Name] = new Dictionary<string, FamilySymbolInfo> { };
                }
                FamilySymbolInfo fsi = new FamilySymbolInfo(fs.UniqueId, fs.FamilyName, fs.Name);
                familySymbolsDict[fs.Category.Name][fs.UniqueId] = fsi;
            }
            string json_str = JsonSerializer.Serialize(familySymbolsDict);
            return json_str;
        } 
    }
}
