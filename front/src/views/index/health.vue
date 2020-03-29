<template>
<div>
 <div class="single">
        <div class="title">单个文件上传</div>
        <input type="file" name="singleFile" id="singleFile">
        <button class="submit" @click="submit">上传</button>
        <img src="" alt="" id="img">
    </div>

</div>
</template>

<script>
export default {
methods:{
  submit(){
 
            var fileList = $('#singleFile')[0].files;
            console.log(fileList);
            var formData = new FormData();
            //此处文件名必须为 singleFile ，因为后台设置仅接口此文件名
            formData.append('file', fileList[0]);
 
            $.ajax({
                url: '/api/upload/img',
                type: 'post',
                processData: false,
                contentType: false,//使用multer配合ajax时无需配置multipart/form-data，multer将自动配置，手动配置将报错，boundary not found
                data: formData,
                success: function (data) {
                    console.log(data)
                    $('#img').attr('src', data.data)
                }
            })


  }
}
}
</script>

<style>

</style>