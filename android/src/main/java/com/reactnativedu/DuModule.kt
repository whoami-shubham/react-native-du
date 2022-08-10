package com.reactnativedu
import android.annotation.SuppressLint
import android.app.DownloadManager
import android.app.DownloadManager.Query
import android.content.Context
import android.net.Uri
import android.os.Environment
import android.util.Log
import com.facebook.react.bridge.*


class DuModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return "DownloadUtil"
  }

  // desc : description of download manager
  // fileName: fileName with extension
  private fun download(context: Context, url: String, fileName: String, desc: String): Long {
    val request = DownloadManager.Request(Uri.parse(url))
      .setAllowedNetworkTypes(DownloadManager.Request.NETWORK_WIFI or DownloadManager.Request.NETWORK_MOBILE)
      .setTitle(fileName)
      .setDescription(desc)
      .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
      .setAllowedOverMetered(true)
      .setAllowedOverRoaming(true)
      .setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName)
    val downloadManager = context.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager

    return downloadManager.enqueue(request)
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  fun downloadFile(url: String, fileName: String, desc: String, promise: Promise) {
    try {
      val id = download(reactContext, url, fileName, desc)
      val array = WritableNativeArray()
      array.pushString(id.toString())
      promise?.resolve(array)

    } catch (e: Exception) {
      promise?.reject(e)
    }
  }

  @SuppressLint("Range")
  @ReactMethod
  fun getDownloadStatus(downloadId: String,promise: Promise) {
    try {
      val result = WritableNativeArray()
      val downloadManager = reactContext.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
      val query = Query()
      query.setFilterById(downloadId.toLong()) // filter your download by download Id
      val cursor = downloadManager.query(query)
      if (cursor.moveToFirst()) {
        val status = cursor.getInt(cursor.getColumnIndex(DownloadManager.COLUMN_STATUS))
        cursor.close()
        Log.i("DOWNLOAD_STATUS", status.toString())
        result.pushString(status.toString())
        promise.resolve(result);
      }
      result.pushString("-1")
      promise?.resolve(result)
    }
    catch (e: Exception){
      promise?.reject(e)
    }
  }
}
