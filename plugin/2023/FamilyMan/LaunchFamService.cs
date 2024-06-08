using System;
using System.Diagnostics;
using Autodesk.Revit.UI;
using System.IO;
using Microsoft.Web.WebView2.Wpf;
using Microsoft.Web.WebView2.Core;

namespace FamilyMan
{
    public class LaunchFamService
    {
        private WebView2 webView;
        private readonly RevitEvent revitEvent;
        public Action CloseAction { get; set; }

        internal LaunchFamService(UIApplication a, WebView2 webView)
        {
            this.webView = webView;
            revitEvent = new RevitEvent();
            // Instead of using an actual URI, we generate the page locally and intercept a resource call to a nonexistent URI.
            LoadContent();
        }

        private async void LoadContent()
        {
            CoreWebView2Environment env = await CoreWebView2Environment.CreateAsync(userDataFolder: "C:/Temp");
            await webView.EnsureCoreWebView2Async(env);

            webView.CoreWebView2.AddWebResourceRequestedFilter("http://nimblesim/*", CoreWebView2WebResourceContext.All);
            webView.CoreWebView2.WebResourceRequested += delegate (object sender, CoreWebView2WebResourceRequestedEventArgs args)
            {
                string assetsFilePath = Utilities.AssemblyDirectory + "/nimblesim-plugin/pages/"
                                                                        + args.Request.Uri.Substring("http://nimblesim/*".Length - 1);
                Debug.WriteLine(Utilities.AssemblyDirectory);
                Debug.WriteLine(assetsFilePath);
                Debug.WriteLine(args.Request.Uri);
                //CoreWebView2WebResourceContext resourceContext = args.ResourceContext;
                try
                {
                    FileStream fs = File.OpenRead(assetsFilePath);
                    ManagedStream ms = new ManagedStream(fs);
                    string headers = "";
                    if (assetsFilePath.EndsWith(".html"))
                    {
                        headers = "Content-Type: text/html";
                    }
                    else if (assetsFilePath.EndsWith(".jpg"))
                    {
                        headers = "Content-Type: image/jpeg";
                    }
                    else if (assetsFilePath.EndsWith(".png"))
                    {
                        headers = "Content-Type: image/png";
                    }
                    else if (assetsFilePath.EndsWith(".css"))
                    {
                        headers = "Content-Type: text/css";
                    }
                    else if (assetsFilePath.EndsWith(".js"))
                    {
                        headers = "Content-Type: application/javascript";
                    }
                    else if (assetsFilePath.EndsWith(".json"))
                    {
                        headers = "Content-Type: application/json";
                    }
                    args.Response = webView.CoreWebView2.Environment.CreateWebResourceResponse(
                                                            ms, 200, "OK", headers);
                }
                catch (Exception ex)
                {
                    Debug.WriteLine("Failed to get.");
                    Debug.WriteLine(ex.Message);
                    args.Response = webView.CoreWebView2.Environment.CreateWebResourceResponse(
                                                        null, 404, "Not found", "");
                }
            };
            webView.CoreWebView2.Navigate("http://nimblesim/send.html");
        }
    }


    public class RevitEvent : IExternalEventHandler
    {
        private Action<UIApplication> action;
        private readonly ExternalEvent externalEvent;
        public RevitEvent()
        {
            externalEvent = ExternalEvent.Create(this);
        }
        public void Run(Action<UIApplication> action)
        {
            this.action = action;
            externalEvent.Raise();
        }
        public void Execute(UIApplication app)
        {
            try
            {
                action?.Invoke(app);
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
            }
        }
        public string GetName() => nameof(RevitEvent);
    }
}
