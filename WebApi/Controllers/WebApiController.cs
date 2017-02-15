using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Runtime.Serialization;


namespace WebApi.Controllers
{
    public class WebApiController : ApiController
    {
        HttpClient client = new HttpClient();
        public static string accessToken { get; set; }
        // GET: api/Api
        [Route("Authenticate")]
        public HttpResponseMessage Get()
        {
            string URL = "https://login.live.com/oauth20_authorize.srf";
            string urlParameters = "?client_id=c65a0efe-ef12-4bbc-9255-f965789f2522 &scope=wl.basic onedrive.readwrite &response_type=code&redirect_uri=http://localhost:11942/uploadpage.html";
            client.BaseAddress = new Uri(URL);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            HttpResponseMessage response = client.GetAsync(urlParameters).Result;
            return response;
        }

        //GET: api/Api/5
        [Route("GetFiles")]
        public HttpResponseMessage Get([FromBody]int access_Token)
        {
            //string[] word = id.Split('"');
            //accessToken = word[1];
            string URL = "https://api.onedrive.com/v1.0/drive/items/root:/Favorites/:";
            string urlParameters = "?expand=children&access_token=" + accessToken;
            client.BaseAddress = new Uri(URL);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            HttpResponseMessage response = client.GetAsync(urlParameters).Result;
            return response;
        }

        [Route("Download/{item_id}")]
        public HttpResponseMessage Get([FromUri] string item_id)
        {
            string URL = "https://api.onedrive.com/v1.0/drive/items/"+item_id+"/content";
            string urlParameters = "?access_token=" + accessToken;
            client.BaseAddress = new Uri(URL);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            HttpResponseMessage response = client.GetAsync(urlParameters).Result;
            return response;
        }
        // POST: api/Api
        [Route("Redeem")]
        public string Post([FromBody]string value)
        {
            var request = (HttpWebRequest)WebRequest.Create("https://login.live.com/oauth20_token.srf");
            var postData="client_id=c65a0efe-ef12-4bbc-9255-f965789f2522";
            postData+="&redirect_uri=http://localhost:11942/uploadpage.html";
            postData += "&client_secret=Fdbug7pJtcxMxfHtN89AWrs";
            postData += "&code="+ value;
            postData += "&grant_type=authorization_code";
            var data = Encoding.ASCII.GetBytes(postData);
            request.Method = "POST";
            request.ContentType = "application/x-www-form-urlencoded";
            request.ContentLength = data.Length;

            using (var stream = request.GetRequestStream())
            {
                stream.Write(data, 0, data.Length);
            }

            var response1 = (HttpWebResponse)request.GetResponse();
            StreamReader sr = new StreamReader(response1.GetResponseStream(), Encoding.UTF8);
            string html = sr.ReadToEnd();
            string[] word1 = html.Split(',');
            string[] word2 = word1[3].Split(':');
            string[] word3 = word2[1].Split('"');
            accessToken = word3[1];
            //Stream receiveStream = response.GetResponseStream();
            //StreamReader readStream = new StreamReader(receiveStream);
            //var serializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            //var jsonObject = serializer.DeserializeObject(readStream.ReadToEnd());
            return accessToken;
        }

        [HttpPut]
        [Route("Upload")]
        public async Task<string> Put()
        {
            if (!Request.Content.IsMimeMultipartContent())
            {
                return "The request doesn't contain valid content!";
            }
            var request = (HttpWebRequest)WebRequest.Create("https://api.onedrive.com/v1.0/drive/root:/Favorites/DL.pdf:/content?access_token=" + accessToken);
            request.Method = "PUT";
            request.ContentType = "application/*";
            try
            {
                var provider = new MultipartMemoryStreamProvider();
                await Request.Content.ReadAsMultipartAsync(provider);
                foreach (var file in provider.Contents)
                {
                    byte[] bytes;
                    var dataStream = await file.ReadAsStreamAsync();
                    using (MemoryStream ms = new MemoryStream())
                    {
                        dataStream.CopyTo(ms);
                        bytes= ms.ToArray();
                    }

                    request.ContentLength = dataStream.Length;
                    Stream data= request.GetRequestStream();
                    data.Write(bytes, 0, bytes.Length);
                    data.Close();
                }
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                string returnString = response.StatusCode.ToString();
                return returnString;
            }
            catch (Exception e)
            {
                return "error";
            }
        }
        // DELETE: api/Api/5
        public void Delete(int id)
        {
        }
    }
}
