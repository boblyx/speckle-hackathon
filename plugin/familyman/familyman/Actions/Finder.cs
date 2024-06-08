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

namespace familyman.Actions
{
    public class FamilySymbolInfo
    {
        public string uuid { get; set; }
        public string name { get; set; }
        public string ftype { get; set; }
        public int count { get; set; }
        //public string 
        public FamilySymbolInfo(string uuid, string name, string ftype, int count = 0)
        {
            this.uuid = uuid;
            this.name = name;
            this.ftype = ftype;
            this.count = count;
        }
    }

    public class SimpleParameter
    {
        public string id { get; set; }
        public string guid { get; set; }
        public string name { get; set; }
        public string unit_type { get; set; }
        public string value { get; set; }
        public bool shared { get; set; }

        public SimpleParameter(string id, string guid, string name, string unit_type, string value, bool shared = false) {
            this.guid = guid;
            this.id = id;
            this.name = name;
            this.unit_type = unit_type;
            this.value = value;
            this.shared = shared;
        }
    }
    class Finder
    {
        /// <summary>
        /// Returns JSON string of dict indexed by family categories
        /// </summary>
        /// <param name="app"></param>
        /// <returns></returns>
        public static string getFamilySymbols_Sort_Category(UIApplication app)
        {
            Document doc = app.ActiveUIDocument.Document;
            Dictionary<string, Dictionary<string, FamilySymbolInfo>> familySymbolsDict = new Dictionary<string, Dictionary<string, FamilySymbolInfo>> { };
            //Dictionary<string, FamilySymbolInfo> fsis = new Dictionary<string, FamilySymbolInfo>();
            FilteredElementCollector fc = new FilteredElementCollector(doc);
            var symbols = fc.OfClass(typeof(FamilySymbol));
            foreach (FamilySymbol fs in fc)
            {
                if (!(familySymbolsDict.ContainsKey(fs.Category.Name)))
                {
                    familySymbolsDict[fs.Category.Name] = new Dictionary<string, FamilySymbolInfo> { };
                }
                FamilySymbolInfo fsi = new FamilySymbolInfo(fs.UniqueId, fs.FamilyName, fs.Name);
                familySymbolsDict[fs.Category.Name][fs.UniqueId] = fsi;
            }
            string json_str = JsonSerializer.Serialize(familySymbolsDict);
            return json_str;
        }

        public static string getParameters_Of_Uuid(UIApplication app, string uuid)
        {
            Document doc = app.ActiveUIDocument.Document;
            Element obj = doc.GetElement(uuid);
            IList<Parameter> parameters = obj.GetOrderedParameters();
            Dictionary<string, SimpleParameter> simp_dict = new Dictionary<string, SimpleParameter>();
            foreach (Parameter p in parameters) {
                try
                {
                    string id = p.Id.ToString();
                    string name = p.Definition.Name;
                    string unit_type = "NULL";//p.GetUnitTypeId().ToString();
                    string guid = "NULL";//p.GUID.ToString();
                    string value = p.AsValueString();
                    bool shared = p.IsShared;
                    SimpleParameter simp = new SimpleParameter(id, guid, name,
                        unit_type, value, shared);
                    simp_dict[id] = simp;
                }
                catch (Exception e) {
                    Debug.WriteLine(e);
                }
            }
            string json_str = JsonSerializer.Serialize(simp_dict);
            return json_str;
        }
    }
}
