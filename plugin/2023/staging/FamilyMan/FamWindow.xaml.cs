using Autodesk.Revit.UI;
using System;
using System.Windows;
using System.Windows.Input;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.Wpf;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Collections.Generic;

namespace FamilyMan
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class FamWindow : Window
    {
        //private bool _firstLoad = true;
        //private MainWindowView view;
        private LaunchFamService launchSender;
        public UIApplication uiApp;
        public bool isLoaded = false;
        public WebView2 webViewObj;

        public FamWindow(UIApplication app)
        {
            InitializeComponent();
            launchSender = new LaunchFamService(app, webView);
            DataContext = launchSender;
            launchSender.CloseAction = new Action(this.Close);
            uiApp = app;
            webViewObj = webView;
        }

        internal class WvReceiveAction
        {
            public string action;
            public object payload;
        }

        private async void OnWebViewInteraction(object sender, CoreWebView2WebMessageReceivedEventArgs e)
        {
            WvReceiveAction result = null;
            try
            {
                result = JsonConvert.DeserializeObject<WvReceiveAction>(e.WebMessageAsJson);
                Debug.WriteLine(result.action);
                Debug.WriteLine(result.payload);
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
            }

            if(result == null) { return; };

            switch (result.action)
            {
                case "getFamilies_Sort_Category":
                    Debug.WriteLine("Getting all families by category!");
                    App.rvtHandler.Raise(RevitEventHandler.RevitActionsEnum.getFamilies_Sort_Category);
                    break;

                case "loaded":
                    Debug.WriteLine("Commencing payload assembly");
                    isLoaded = true;
                    App.rvtHandler.Raise(RevitEventHandler.RevitActionsEnum.Loaded);
                    break;

                default:
                    Debug.WriteLine("Unhandled action. Terminating.");
                    break;
            }
        }

        public async void SendPayload(string fn, string payload)
        {
            string payloadScript = "document.dispatchEvent(new CustomEvent(\"" + fn + "\", {\"detail\":" + payload + "}))";
            Debug.WriteLine(payloadScript);
            var res1 = await webView.CoreWebView2.ExecuteScriptAsync(payloadScript);
            Debug.WriteLine(res1);
            return;
        }

        private void DragWindow(object sender, MouseButtonEventArgs e)
        {
            try
            {
                DragMove();
            }
            catch { }
        }
    }
}
