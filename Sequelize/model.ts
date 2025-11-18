import AmountPurcase from "./Table/Analytics/AmountPurcase";
import InventoryCountRequest from "./Table/Analytics/InventoryRequest";
import Loss from "./Table/Analytics/Loss";
import Profit from "./Table/Analytics/Profit";
import SalesCount from "./Table/Analytics/SalesCount";
import ChatGroup from "./Table/Chat/ChatGroup";
import ChatMessage from "./Table/Chat/ChatMessage";
import PinnedChat from "./Table/Chat/PinnedChat";
import CityMaster from "./Table/CityMaster";
import InventoryRequest from "./Table/InventoryRequest";
import InventoryRequestActivities from "./Table/InventoryRequestActivities";
import ItemSchema from "./Table/Layout/ItemSchema";
import SectionSchema from "./Table/Layout/SectionSchema";
import OrganizationDetails from "./Table/OrganizationDetails";
import ProductType from "./Table/ProductType";
import SellRecords from "./Table/Sells/SellRecord";
import Category from "./Table/Shop/Category";
import ShopDetails from "./Table/ShopDetails";
import Container from "./Table/ShopInventory/Container";
import ContainerColumnDetails from "./Table/ShopInventory/ContainerColumnDetails";
import ContainerRowDetails from "./Table/ShopInventory/ContainerRowDetails";
import ProductInventory from "./Table/ShopInventory/ProductInventory";
import ShopNotes from "./Table/ShopInventory/ShopNotes";
import Notification from "./Table/User/Notification";
import UserMaster from "./Table/User/UserMaster";


const model: Record<string, any> = {
    InventoryRequestTable: InventoryRequest,
    ProductType: ProductType,
    InventoryRequestActivities: InventoryRequestActivities,
    CityMaster: CityMaster,
    UserMaster: UserMaster,
    OrganizationDetails: OrganizationDetails,
    ShopDetails: ShopDetails,
    InventoryCountRequest: InventoryCountRequest,
    Loss: Loss,
    Profit: Profit,
    AmountPurcase: AmountPurcase,
    SalesCount: SalesCount,
    Container: Container,
    ContainerRowDetails: ContainerRowDetails,
    ContainerColumnDetails: ContainerColumnDetails,
    ProductInventory: ProductInventory,
    SellRecords: SellRecords,
    ShopNotes: ShopNotes,
    PinnedChat: PinnedChat,
    ChatMessage: ChatMessage,
    ChatGroup: ChatGroup,
    Category: Category,
    ItemSchema: ItemSchema,
    SectionSchema: SectionSchema,
    Notification: Notification
};

OrganizationDetails.hasMany(UserMaster);
UserMaster.belongsTo(OrganizationDetails);

OrganizationDetails.hasMany(ShopDetails);
ShopDetails.belongsTo(OrganizationDetails);

OrganizationDetails.hasMany(InventoryRequest);
InventoryRequest.belongsTo(OrganizationDetails);

ShopDetails.hasMany(InventoryRequest);
InventoryRequest.belongsTo(OrganizationDetails);


OrganizationDetails.hasMany(InventoryCountRequest);
InventoryCountRequest.belongsTo(OrganizationDetails);


ShopDetails.hasMany(InventoryCountRequest);
InventoryCountRequest.belongsTo(ShopDetails);

OrganizationDetails.hasMany(Loss);
Loss.belongsTo(OrganizationDetails);

ShopDetails.hasMany(Loss);
Loss.belongsTo(OrganizationDetails);

OrganizationDetails.hasMany(Profit);
Profit.belongsTo(OrganizationDetails);

ShopDetails.hasMany(Profit);
Profit.belongsTo(OrganizationDetails);

OrganizationDetails.hasMany(AmountPurcase);
AmountPurcase.belongsTo(OrganizationDetails);

ShopDetails.hasMany(AmountPurcase);
AmountPurcase.belongsTo(OrganizationDetails);

OrganizationDetails.hasMany(SalesCount);
SalesCount.belongsTo(OrganizationDetails);

ShopDetails.hasMany(SalesCount);
SalesCount.belongsTo(OrganizationDetails);

Container.hasMany(ContainerRowDetails);
ContainerRowDetails.belongsTo(Container);

Container.hasMany(ContainerColumnDetails);
ContainerColumnDetails.belongsTo(Container);

ContainerRowDetails.hasMany(ContainerColumnDetails);
ContainerColumnDetails.belongsTo(ContainerRowDetails);

Container.hasMany(ProductInventory);
ProductInventory.belongsTo(Container);

ShopDetails.hasMany(ProductInventory);
ProductInventory.belongsTo(ShopDetails);

ShopDetails.hasMany(Container);
Container.belongsTo(ShopDetails);

ShopDetails.hasMany(SellRecords);
SellRecords.belongsTo(ShopDetails);

ShopDetails.hasMany(ShopNotes);
ShopNotes.belongsTo(ShopDetails);

OrganizationDetails.hasMany(ItemSchema);
ItemSchema.belongsTo(OrganizationDetails);

ShopDetails.hasOne(ItemSchema);
ItemSchema.belongsTo(ShopDetails);

OrganizationDetails.hasMany(SectionSchema);
SectionSchema.belongsTo(OrganizationDetails);

ShopDetails.hasMany(SectionSchema);
SectionSchema.belongsTo(ShopDetails);

UserMaster.hasMany(Notification);
Notification.belongsTo(UserMaster);

export default model;