﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using System.Threading;
using CK.Monitoring;
using CK.Core;

namespace WebApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            bool createdNew;
            using( Mutex m = new Mutex( true, "Invenietis.CK.AspNet.Auth.Integration.WebApp", out createdNew ) )
            {
                if( createdNew )
                {
                    SystemActivityMonitor.RootLogPath = Directory.GetCurrentDirectory() + "Logs";
                    var config = new GrandOutputConfiguration();
                    config.AddHandler( new CK.Monitoring.Handlers.TextFileConfiguration() { Path = "Text" } );
                    GrandOutput.EnsureActiveDefault( config );
                    
                    var host = new WebHostBuilder()
                        .UseUrls( "http://localhost:4324" )
                        .UseKestrel()
                        .UseContentRoot( Directory.GetCurrentDirectory() )
                        .UseIISIntegration()
                        .UseStartup<Startup>()
                        .Build();

                    host.Run();

                    GrandOutput.Default.Dispose();
                }
            }
        }
    }
}
