<template>
    <div>
        <van-nav-bar title="所在位置" />
        <van-field v-model="data.keywords" id="tipinput" placeholder="请输入地点"
                   @update:model-value="search"/>
        <van-cell v-for="address in data.addresses" :key="address.id" :title="address.name"
                  @click="selectAddress(address)">
            <template #right-icon>
                <van-icon name="checked" class="search-icon" v-if="address.isSelect"/>
            </template>
        </van-cell>
    </div>
    <div id="map">
    </div>
</template>
<script>
import {onMounted, reactive, ref} from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";

export default {
    setup() {
        const data = reactive({
            navbarTitle: '所在位置',
            keywords: '',
            addresses: []
        })
        const address = ref('');
        const isCloseMap = ref(false);
        /**
         * 初始化地图
         */
        const initMap = () => {
            AMapLoader.load({
                key: 'e4b6558cdaaa2a9c2c19da99655a6e3f',
                version: '2.0'
            }).then(AMap => {
                const map = new AMap.Map("map", {
                    viewMode: '3D',
                    zoom: 10, //初始化地图级别
                    center: [120.374926, 30.310678], //初始化地图中心点位置,
                    resizeEnable: true
                })
                AMap.plugin(["AMap.Geolocation"], function () {
                    var geolocation = new AMap.Geolocation({
                        showButton: true, // 是否显示定位按钮
                        buttonPosition: 'LB', // 定位按钮的位置
                        buttonOffset: new AMap.Pixel(10, 20), // 定位按钮距离对应角落的距离
                        showMarker: true, // 是否显示定位点
                        showCircle: true, // 是否显示定位精度圈
                        circleOptions: { // 定位精度圈的样式
                            strokeColor: '#0093FF',
                            noSelect: true,
                            strokeOpacity: 0.5,
                            strokeWeight: 1,
                            fillColor: '#02B0FF',
                            fillOpacity: 0.25
                        },
                        zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点
                    });
                    map.addControl(geolocation);
                    geolocation.getCurrentPosition(function (status, result) {
                        if (status === "complete") {
                            onComplete(result);
                        } else {
                            onError(result);
                        }
                    })
                })
            })
        }
        const searchAddress = () => {
            AMapLoader.load({
                key: 'e4b6558cdaaa2a9c2c19da99655a6e3f',
                version: '2.0'
            }).then(AMap => {
                const map = new AMap.Map("map", {
                    viewMode: '3D',
                    zoom: 10, //初始化地图级别
                    center: [120.374926, 30.310678], //初始化地图中心点位置,
                    resizeEnable: true
                })
                AMap.plugin(["AMap.PlaceSearch", "AMap.AutoComplete"], function () {
                    var autoOptions = {
                        input: 'tipinput',
                        city: '全国',
                        map: map
                    }
                    var placeSearch = new AMap.PlaceSearch(autoOptions);
                    placeSearch.search(data.keywords, function (status, result) {
                        console.log(status,result)
                        if (status === 'complete') {
                            data.addresses = result.poiList.pois
                            data.addresses.forEach(address => {
                                address.isSelect = false
                            })
                        }
                    })
                })
            })
        }
        const onComplete = (data) => {
            console.log(data)
        }
        const onError = (data) => {
            console.log(data)
        }
        const search = () => {
            searchAddress()
        }
        /**
         * 选择地址
         * @param address
         */
        const selectAddress = (currentAddress) => {
            currentAddress.isSelect = true
            data.keywords = currentAddress.name
            address.value = currentAddress.name
            isCloseMap.value = true
            // 将其他全部置为false
            data.addresses = data.addresses.filter(address => {
                return address.id === currentAddress.id
            })
        }
        onMounted(() => {
                initMap()
            }
        )
        return {
            data,
            address,
            isCloseMap,
            search,
            selectAddress
        }

    }
}
</script>

<style>
#map {
    margin-top: 50px;
    width: 100%;
    height: 800px;
}
</style>