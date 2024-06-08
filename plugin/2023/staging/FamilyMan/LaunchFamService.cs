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
        private string familyman_url = "http://localhost:3000";

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
            webView.CoreWebView2.Navigate(familyman_url);
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
