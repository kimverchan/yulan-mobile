<template>
  <div class="areaQuery">
    <top :top="set"></top>
    <span class="search-button" @click="searchData">查询</span>
    <div class="search">
      <ul class="ulhead">
        <div>
          <span @click="showType_1 = true">
            <input class="time_1" type="text" v-model="myArea" disabled />
          </span>
          <span @click="showType_2 = true">
            <input class="time_1" type="text" v-model="myDistrict" disabled />
          </span>
          <span @click="showType_3 = true">
            <input
              class="time_1"
              type="text"
              v-model="myCustomerType"
              disabled
            />
          </span>
        </div>

        <div style="margin: -24px 0 0 10px">
          <van-search
            placeholder="客户筛选"
            v-model="customer_filter"
            @search="getCustomerDataList"
            class="search_1"
          />
          <van-button
            class="choose"
            style="margin-left: 30px"
            @click="getCustomerDataList"
            round
            >搜索客户</van-button
          >
        </div>
        <hr />
        <div>
          <span @click="showType_4 = true">
            <input type="text" v-model="ksDataSet" class="time_1" disabled />
          </span>
          <span @click="showType_5 = true">
            <input type="text" v-model="jsDataSet" class="time_1" disabled />
          </span>
          <span @click="showType_6 = true" style>
            <input type="text" v-model="myStatus" class="time_1" disabled />
          </span>
        </div>
        <div style="margin: 5px 0 0 10px; text-align: left">
          <van-button class="choose" @click="checkAll" round>全选</van-button>
          <van-button class="choose" @click="toggleAll" round>反选</van-button>
          <van-button class="choose" @click="clear" round>重置</van-button>
          <span
            style="
              float: right;
              margin: 15px 5px 0 0;
              font-size: 12px;
              color: #909399;
            "
            v-if="customerData.length"
            >{{ selectCustomer.length }}/{{ customerData.length }}</span
          >
        </div>
      </ul>
    </div>
    <div class="queryData">
      <div style="margin: 0 0 10px 10px">
        <van-checkbox-group v-model="selectCustomer" ref="checkboxGroup">
          <van-checkbox
            style="text-align: left; margin-top: 7px; font-size: 15px"
            :name="customerData.CUSTOMER_CODE"
            v-for="customerData in customerData"
            :key="customerData.CUSTOMER_CODE"
            >{{ customerData.CUSTOMER_NAME }}</van-checkbox
          >
        </van-checkbox-group>
      </div>
    </div>
    <!--市场-->
    <van-popup v-model="showType_1" position="bottom">
      <van-picker
        show-toolbar
        title="请选择市场"
        :columns="areaCode_name"
        @confirm="onAreaCode"
        @cancel="cancelArea"
      />
    </van-popup>
    <!--片区-->
    <van-popup v-model="showType_2" position="bottom">
      <van-picker
        show-toolbar
        title="请选择片区"
        :columns="district_name"
        @confirm="onDISTRICT_ID"
        @cancel="cancelDistrict"
      />
    </van-popup>
    <!--客户类型-->
    <van-popup v-model="showType_3" position="bottom">
      <van-picker
        show-toolbar
        title="请选择客户类型"
        :columns="customerTypeData"
        @confirm="onCUSTOMER_TYPE"
        @cancel="cancelCustomer"
      />
    </van-popup>
    <!--日期选择-->
    <van-popup v-model="showType_4" position="bottom">
      <van-datetime-picker
        v-model="ksData"
        type="date"
        :show-toolbar="true"
        :title="'选择时间'"
        @confirm="confirmTimeks"
        @cancel="cancelTimeks"
      />
    </van-popup>
    <van-popup v-model="showType_5" position="bottom">
      <van-datetime-picker
        class="reset"
        v-model="jsData"
        type="date"
        :title="'选择时间'"
        @confirm="confirmTimejs"
        @cancel="cancelTimejs"
      />
    </van-popup>
    <!--状态搜索-->
    <van-popup v-model="showType_6" position="bottom">
      <van-picker
        show-toolbar
        title="请选择状态"
        :columns="STATUS"
        @confirm="onStatus"
        @cancel="cancelStatus"
      />
    </van-popup>
    <!-- 查看客户总金额 -->
    <van-popup
      v-model="showMoney"
      position="bottom"
      :style="{ 'max-height': '75%' }"
      closeable
      close-icon="close"
    >
      <div style="width: 90%; margin: 0 auto">
        <div style="font-size: 15px; color: blue; margin-top: 30px">
          提货单金额汇总：{{ sumOrderMoney }}元
        </div>
        <div
          class="single-bank"
          style="width: 100%"
          v-for="(singleBank, index) in customerOrderData"
          :key="index"
        >
          <van-panel style="margin-top: 10px">
            <table style="font-size: 14px; width: 90%">
              <tr>
                <td>客户名称：</td>
                <td>{{ singleBank.CUSTOMER_NAME }}</td>
              </tr>
              <tr>
                <td>提货单号：</td>
                <td>
                  <a
                    href="javascript:void(0);"
                    @click="getOrderDetail(singleBank)"
                    >{{ singleBank.SALE_NO }}</a
                  >
                </td>
              </tr>
              <tr>
                <td>状态：</td>
                <td>{{ singleBank.STATUS_ID | transStatus }}</td>
              </tr>
              <tr>
                <td style="width: 100px">B2B订单号：</td>
                <td>{{ singleBank.CONTRACT_NO }}</td>
              </tr>
              <tr>
                <td>单据类型：</td>
                <td>{{ singleBank.BILL_ID | transType }}</td>
              </tr>
              <tr>
                <td>开单日期：</td>
                <td>{{ singleBank.BILL_ID | datatrans }}</td>
              </tr>
              <tr>
                <td>提货日期：</td>
                <td>{{ singleBank.DATE_OUT_STOCK | datatrans }}</td>
              </tr>
              <tr>
                <td>金额：</td>
                <td>{{ singleBank.MONEY_SUM }}</td>
              </tr>
              <tr>
                <td>运输方式：</td>
                <td>{{ singleBank.TRANSTYPE_NAME }}</td>
              </tr>
              <tr>
                <td>运输单号：</td>
                <td>{{ singleBank.TRANS_ID }}</td>
              </tr>
              <tr>
                <td>合同号：</td>
                <td>{{ singleBank.HTBM }}</td>
              </tr>
            </table>
            <hr />
          </van-panel>
        </div>
      </div>
    </van-popup>

    <van-popup
      v-model="showDetail"
      position="bottom"
      :style="{ 'max-height': '75%' }"
      closeable
      close-icon="close"
    >
      <van-panel title="提货单详情" style="font-size: 14px">
        <div style="width: 90%; margin: 0 auto">
          <div
            class="single-bank"
            v-for="(detail, index) in tableDetail"
            :key="index"
          >
            <table>
              <tr>
                <td>状态:</td>
                <td>{{ detail.STATUS_ID | transStatus }}</td>
              </tr>
              <tr>
                <td>型号：</td>
                <td>{{ detail.ITEM_NO }}</td>
              </tr>
              <tr>
                <td>批次：</td>
                <td>{{ detail.BATCH_NO }}</td>
              </tr>
              <tr>
                <td>版本：</td>
                <td>{{ detail.PRODUCTVERSION_NAME }}</td>
              </tr>
              <tr>
                <td>仓库：</td>
                <td>{{ detail.NOTE }}</td>
              </tr>
              <tr>
                <td>发货数：</td>
                <td>{{ detail.QTY_DELIVER }}</td>
              </tr>
              <tr>
                <td>物流单价：</td>
                <td>{{ detail.TRANS_PRICE }}</td>
              </tr>
              <tr>
                <td>单价:</td>
                <td>{{ detail.SALE_PRICE }}</td>
              </tr>
              <tr>
                <td>金额:</td>
                <td>{{ detail.MONEY }}</td>
              </tr>
            </table>
            <hr />
          </div>
        </div>
      </van-panel>
    </van-popup>
  </div>
</template>

<script>
import axios from "axios";
import top from "../../../components/Top";
import {
  DatetimePicker,
  Popup,
  Picker,
  Pagination,
  Toast,
  Loading,
  Field,
  Button,
  Panel,
  TreeSelect,
  Checkbox,
  CheckboxGroup,
  Search,
  Radio,
} from "vant";
import {
  getAreaCode,
  getDistrictByAreaCode,
  getCustomerDataForPack,
  getCustomerByAreaCode,
  getPackDetails,
  getPackDetailsBySaleNo,
  getPackDetailsType,
  getTotalMoneySum,
  getCustomerName,
  getPackByCustomer,
} from "@/api/areaInfoASP";
export default {
  name: "areaQuery",
  data() {
    return {
      selectAreaCode: "",
      selectAreaDistinct: "",
      selectCustomerType: "",
      customerOrderData: [],
      customerOrderTaskData: [],
      myStatus: "全部状态",
      selectOrderType: "",
      ksData: "",
      ksDataSet: "", //  开始时间
      jsData: "",
      jsDataSet: "", //结束时间
      customer_filter: "",
      selectCustomer: [],
      myCustomerType: "客户类型",
      myCustomerTypeCode: "",
      myDistrict: "片区", //片区状态
      myDistrictId: "",
      district_name: [],
      myArea: "市场", //市场状态
      myAreaCode: "",
      areaCode_name: [],
      showType_1: false,
      showType_2: false,
      showType_3: false,
      showType_4: false,
      showType_5: false,
      showType_6: false,
      showMoney: false,
      showDetail: false,
      set: 91,
      tableDetail: [],
      selectAreaCode: "",
      selectAreaDistinct: "",
      customerData: [],
      limit: 8,
      count: 0,
      currentPage: 1,
      AREA_DISTRICT_1: {
        DISTRICT_ID: "",
        DISTRICT_NAME: "全部",
      },
      customerTypeData: ["全部", "非专业市场客户", "专业市场客户"],
      areaCodeList: [],
      STATUS: ["全部", "待提", "已提货", "作废", "已月结"],
    };
  },
  components: {
    top,
    [Popup.name]: Popup,
    [Pagination.name]: Pagination,
    [Toast.name]: Toast,
    [Loading.name]: Loading,
    [Field.name]: Field,
    [Button.name]: Button,
    [Panel.name]: Panel,
    [TreeSelect.name]: TreeSelect,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [Search.name]: Search,
    [DatetimePicker.name]: DatetimePicker,
    [Radio.name]: Radio,
  },
  filters: {
    transStatus(value) {
      switch (value) {
        case "1":
          return "待提";
        case "2":
          return "已提货";
        case "3":
          return "作废";
        case "4":
          return "已月结";
          break;
      }
    },
    transType(value) {
      switch (value) {
        case "0":
          return "冲减单";
        case "3":
          return "退货单";
        default:
          return "提货单";
          break;
      }
    },
    datatrans(value) {
      //时间戳转化大法
      if (value == null || value == "9999/12/31 00:00:00") {
        return "";
      }
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " "; /* + h + ':' + m + ':' + s; */
    },
  },
  computed: {
    sumOrderMoney() {
      var sum = 0;
      for (var i = 0; i < this.customerOrderTaskData.length; i++) {
        sum = sum.add(this.customerOrderTaskData[i].MONEY_SUM);
      }
      return sum;
    },
  },
  //生命周期
  created() {
    this.jsSet(new Date());
    this.ksSet(new Date());
    this.getAreaCodeData();
  },
  activated() {
    //this._queryQuYu_1();
  },
  methods: {
    cancelArea() {
      this.showType_1 = false;
    },
    cancelDistrict() {
      this.showType_2 = false;
    },
    cancelCustomer() {
      this.showType_3 = false;
    },
    cancelTimeks() {
      this.showType_4 = false;
    },
    cancelTimejs() {
      this.showType_5 = false;
    },
    cancelStatus() {
      this.showType_6 = false;
    },
    //开始时间选择
    confirmTimeks(value) {
      this.ksSet2(this.ksData);
      this.showType_4 = false;
    },
    //结束时间选择
    confirmTimejs(value) {
      this.jsSet(this.jsData);
      this.showType_5 = false;
    },
    //开始时间设置
    ksSet2(time) {
      let current_date = time.getDate();
      let current_month = time.getMonth() + 1;
      let current_year = time.getFullYear();
      this.ksDataSet = current_year + "-" + current_month + "-" + current_date;
      this.ksData = time;
    },
    //初始化结束时间
    jsSet(time) {
      let current_date = time.getDate();
      let current_month = time.getMonth() + 1;
      let current_year = time.getFullYear();
      this.jsDataSet = current_year + "-" + current_month + "-" + current_date;
      this.jsData = time;
    },
    //初始化开始时间
    ksSet(time) {
      let current_year = time.getFullYear();
      let current_month = time.getMonth() + 1;
      this.ksDataSet = current_year + "-" + current_month + "-" + "01";
      var reg = new RegExp("-", "g");
      this.ksData = new Date(this.ksDataSet.replace(reg, "/"));
    },
    checkAll() {
      this.selectCustomer = [];
      for (var i = 0; i < this.customerData.length; i++) {
        this.selectCustomer.push(this.customerData[i].CUSTOMER_CODE);
      }
    },
    toggleAll() {
      this.selectCustomer = [];
    },
    //状态
    onStatus(value, index) {
      this.myStatus = value;
      if (this.myStatus == "全部") {
        this.selectOrderType = "";
      } else if (this.myStatus == "待提") {
        this.selectOrderType = "1";
      } else if (this.myStatus == "已提货") {
        this.selectOrderType = "2";
      } else if (this.myStatus == "作废") {
        this.selectOrderType = "3";
      } else if (this.myStatus == "已月结") {
        this.selectOrderType = "4";
      }
      this.showType_6 = false;
    },
    //客户类型
    onCUSTOMER_TYPE(value, index) {
      this.myCustomerType = value;
      if (this.myCustomerType == "全部") {
        this.myCustomerTypeCode = "";
      } else if (this.myCustomerType == "非专业市场客户") {
        this.myCustomerTypeCode = "notspeciality";
      } else if (this.myCustomerType == "专业市场客户") {
        this.myCustomerTypeCode = "speciality";
      }
      this.showType_3 = false;
      this.getCustomerDataList();
    },
    //区域市场
    onAreaCode(value, index) {
      this.myArea = value;
      this.myAreaCode = index;
      this.showType_1 = false;
      this.areaCodeChange();
    },
    //区域片区
    onDISTRICT_ID(value, index) {
      this.myDistrict = value;
      this.myDistrictId = index;
      this.showType_2 = false;
      this.getCustomerDataList();
    },
    //根据用户查区域市场
    getAreaCodeData() {
      this.areaCodeList = [];
      var data = {
        userid: this.$store.state.info.data.loginName,
      };
      getAreaCode(data)
        .then((res) => {
          this.areaCodeList = res.data;
          for (var i = 0; i < this.areaCodeList.length; i++) {
            this.areaCode_name.push(this.areaCodeList[i].AREA_NAME);
          }
          //默认选中第一个市场
          if (this.areaCodeList.length) {
            this.myArea = this.areaCodeList[0].AREA_NAME;
            this.selectAreaCode = this.areaCodeList[0].AREA_CODE;
            this.areaCodeChange();
          }
        })
        .catch((res) => {
          console.log(res);
        });
    },
    areaCodeChange() {
      //根据市场区域查片区和客户
      this.getAreaDistinctData();
      this.getCustomerDataList();
    },
    getAreaDistinctData() {
      this.areaDistinctList = [];
      this.district_name = [];
      getDistrictByAreaCode(
        { areaCode: this.selectAreaCode },
        { loading: false }
      ).then((res) => {
        this.areaDistinctList = res.data;
        this.areaDistinctList.unshift(this.AREA_DISTRICT_1);
        for (var i = 0; i < this.areaDistinctList.length; i++) {
          this.district_name.push(this.areaDistinctList[i].DISTRICT_NAME);
        }
      });
    },
    //根据市场，片区，客户类型查可选用户
    getCustomerDataList() {
      this.customerData = [];
      var data = {
        areaCode: this.selectAreaCode, //市场
        district: this.areaDistinctList, //片区
        customerType: this.myCustomerTypeCode, //客户类型
        condition: this.customer_filter,
      };
      getCustomerDataForPack(data).then((res) => {
        this.customerData = res.data;
        //自动选中所有客户
        this.checkAll();
      });
    },
    //提货单查询
    _queryQuYu_1() {
      if (this.selectCustomer.length == 0) {
        return;
      } else {
        this.searchData();
      }
    },
    searchData() {
      this.currentPage = 1;

      if (this.selectCustomer.length == 0) {
        Toast({
          duration: 2000,
          message: "未选择用户",
        });
        return;
      }
      if (!this.ksDataSet || !this.jsDataSet) {
        Toast({
          duration: 2000,
          message: "未选择时间",
        });
        return;
      }
      this.customerOrderTaskData = [];
      var data = {
        CUSTOMER_CODEs: this.selectCustomer,
        beginTime: this.ksDataSet,
        finishTime: this.jsDataSet,
      };
      data.finishTime = data.finishTime + " 23:59:59";
      getPackByCustomer(data).then((res) => {
        this.customerOrderTaskData = res.data;
      });
      this.getAllCustomerAllOrder();
    },
    getAllCustomerAllOrder() {
      this.customerOrderData = [];
      var data = {
        CUSTOMER_CODEs: this.selectCustomer, //已选用户
        beginTime: this.ksDataSet, //起始时间
        finishTime: this.jsDataSet, //结束时间
        limit: 99999, //限制数
        page: this.currentPage, //页数
      };
      data.finishTime = data.finishTime + " 23:59:59";
      getPackDetails(data).then((res) => {
        this.customerOrderData = res.data;
        if (!this.customerOrderData.length) {
          this.showMoney = false;
          Toast({
            duration: 2000,
            message: "选择的客户无订单",
          });
          return;
        } else {
          this.showMoney = true;
        }
      });
    },
    getOrderDetail(val) {
      var data_2 = {
        saleNo: val.SALE_NO, //所选提货单
      };
      this.tableDetail = [];
      getPackDetailsBySaleNo(data_2).then((res) => {
        this.tableDetail = res.data;
        this.showDetail = true;
      });
    },
    //重置
    clear() {
      this.jsSet(new Date());
      this.ksSet(new Date());
      this.myStatus = "全部状态";
      this.selectOrderType = "";
    },
  },
};
</script>

<style scoped>
.search_1 {
  position: relative;
  top: 35px;
  width: 40%;
  height: 35px;
  padding: 0;
}
.time_1 {
  width: 25%;
  height: 25px;
  margin-left: 5px;
  text-align: left;
  padding-left: 17px;
  font-size: 14px;
  background-image: url("../../assetsorder/time-zk.png");
  background-repeat: no-repeat;
  background-position-x: 85px;
  background-position-y: 2vw;
  background-size: 13px;
}
.choose {
  background: #8bc34a;
  height: 30px;
  line-height: 5px;
  color: rgb(255, 255, 255);
  font-size: 14px;
}
.search-button {
  position: fixed;
  top: 13px;
  right: 15px;
  color: #a0cb8d;
  font-size: 13px;
  padding: 5px 20px;
  border-radius: 15px;
  background: white;
  z-index: 99;
}
.search {
  position: fixed;
  top: 0;
  z-index: 10;
  width: 100%;
}
.queryData {
  width: 100%;
  padding-top: 220px;
  box-sizing: border-box;
}
.ulhead {
  padding: 10px 0 5px 0;
  margin-top: 50px;
  width: 100%;
  background: -webkit-linear-gradient(left, #f2f2f2, #e1e1e1);
}
.single-bank td {
  text-align: left;
}
input {
  background-color: hsla(0, 0%, 100%, 0.3);
  border-radius: 3.467vw;
  outline: none;
  border: none;
  text-decoration: none;
  height: 25px;
  line-height: 25px;
}
</style>