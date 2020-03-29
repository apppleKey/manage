<template>
  <div v-loading="loading">
    <el-tabs type="border-card" v-model="activeName" @tab-click="tabClick">
      <el-tab-pane label="工作记录" name="list">
      <div>
        姓名：
        <el-select v-model="searchUid" @change="search" filterable placeholder="请选择">
          <el-option
            v-for="item in users"
            :key="item.Id"
            :label="item.name+`(${item.nice_name})`"
            :value="item.Id"
          ></el-option>
        </el-select>
        <el-button @click="search">搜索</el-button>
        <el-button type="danger" @click="clearForm">清空</el-button>
      </div>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column label="日期" width="150">
            <template slot-scope="scope">
              <div>{{ scope.row.create_date|formatTime('YMDHMS')}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="user_name" label="姓名" width="120"></el-table-column>
          <el-table-column label="详细信息">
            <template slot-scope="scope">
              <div v-html="scope.row.details.replace(/\n/g,'<br/>')"></div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button @click="viewItem(scope.row)" type="text" size="small">查看</el-button>
              <el-button @click="editItem(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="deleteItem(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="添加" name="edit">
        <el-form :model="form" label-width="80px">
          <el-form-item label="时间">
            <el-date-picker
              v-model="form.create_date"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="timestamp"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="员工姓名">
            <el-select v-model="form.id" filterable placeholder="请选择">
              <el-option
                v-for="item in users"
                :key="item.Id"
                :label="item.name+`(${item.nice_name})`"
                :value="item.Id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="工作内容">
            <el-input type="textarea" v-model="form.details"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addItem">立即录入</el-button>
            <el-button @click="clearForm">清空</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="详细信息" :visible.sync="viewDialogVisible" :modal-append-to-body="false">
      <el-row class="mb10">
        <el-col :span="6">
          <div class="grid-content bg-purple tar">姓名</div>
        </el-col>
        <el-col :span="12" :offset="3">
          <div class="grid-content bg-purple-light tal">{{viewForm.user_name}}</div>
        </el-col>
      </el-row>
      <el-row class="mb10">
        <el-col :span="6">
          <div class="grid-content bg-purple tar">创建时间</div>
        </el-col>
        <el-col :span="12" :offset="3">
          <div class="grid-content bg-purple-light tal">{{viewForm.create_date|formatTime('YMD')}}</div>
        </el-col>
      </el-row>
      <el-row class="mb10">
        <el-col :span="6">
          <div class="grid-content bg-purple tar">工作内容</div>
        </el-col>
        <el-col :span="12" :offset="3">
          <div
            class="grid-content bg-purple-light tal"
            v-html="viewForm.details&&viewForm.details.replace(/\n/g,'<br/>')"
          ></div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="viewDialogVisible = false">好的</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="editDialogVisible" :modal-append-to-body="false">
      <el-form :model="form">
        <el-form-item label="姓名">
          <el-input v-model="editForm.user_name" autocomplete="off" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="editForm.create_date"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="timestamp"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="工作内容">
          <el-input type="textarea" v-model="editForm.details" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editItemSubmit">确定</el-button>
        <el-button type="default" @click="editDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "list",
      viewDialogVisible: false,
      viewDialogVisible: false,
      viewForm: {},
      editDialogVisible: false,
      editForm: {},
      form: {},
      tableData: [],
      loading: false,
      users: [],
      searchUid: ""
    };
  },
  created() {
    this.getUsers();
    this.getData();
    //   var a=`
    //   111111111111
    //   111001100111
    //   110000000011
    //   100000000001
    //   000000000000
    //   100000000001
    //   110000000011
    //   111100001111
    //   111110011111
    //   111111111111
    //   `
    //   var a=`
    //   11111111111
    //   11101000000
    //   11011000101
    //   10011010101
    //   01011010101
    //   11011010101
    //   11011000101
    //   11011111101
    //   11011110011
    //   11111111111

    //   00000000000
    //   00100111110
    //   01110001000
    //   10000001000
    //   01110111110
    //   00100001000
    //   01110001010
    //   00100001001
    //   00110111110
    //   00000000000
    //   `

    //  window.b=a.replace(/1/g,'[拥抱]').replace(/0/g,'[玫瑰]').replace(/\n|\s/g,'');
    // console.log(b)
  },
  methods: {
    getData() {
      this.loading = true;
      this.$http
        .get("/api/work_record/list")
        .then(res => {
          this.loading = false;
          this.tableData = res.data;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    search() {
      this.loading = true;
      this.$http
        .get("/api/work_record/list/search", {
          params: { uid: this.searchUid }
        })
        .then(res => {
          this.loading = false;
          this.tableData = res.data;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    clearForm() {
      this.searchUid = null;
      this.getData();
    },
    getUsers() {
      this.loading = true;
      this.$http
        .get("/api/user/list")
        .then(res => {
          this.loading = false;
          this.users = res.data;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    tabClick() {
      console.log(this.activeName);
      if (this.activeName == "list") {
        this.getData();
      } else {
        // this.form.create_date=new Date();
      }
    },
    viewItem(item) {
      this.viewDialogVisible = true;
      this.viewForm = item;
    },
    editItem(item) {
      this.editDialogVisible = true;
      this.editForm = item;
    },
    editItemSubmit() {
      var form = this.editForm;
      console.log(this.editForm);
      this.$http({
        url: "/api/work_record/edit",
        method: "POST",
        data: {
          details: form.details,
          create_date: form.create_date,
          id: form.Id
        }
      })
        .then(res => {
          this.$message.success(res.msg);
          this.getData();
          this.editDialogVisible = false;
        })
        .catch(err => {
          console.log(err);
          // this.$message.success(err.msg || err);
        });
    },
    deleteItem(item) {
      this.$confirm("删除该项？")
        .then(() => {
          return this.$http({
            url: "/api/work_record/delete",
            method: "POST",
            data: {
              id: item.Id
            }
          });
        })
        .then(res => {
          this.$message.success(res.msg);
          this.getData();
        })
        .catch(err => {
          console.log(err);
          // this.$message.success(err.msg || err);
        });
    },
    addItem() {
      this.$http({
        url: "/api/work_record/add",
        method: "POST",
        data: {
          details: this.form.details,
          id: this.form.id,
          create_date: this.form.create_date
        }
      }).then(res => {
        console.log(res);
        this.clearForm();
        this.$message.success(res.msg);
      });
    },
    clearForm() {
      this.form.details = "";
    }
  }
};
</script>

<style>
</style>