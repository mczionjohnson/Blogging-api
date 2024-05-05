import Blog from "../models/blogSchema";
import * as UserService from "../services/user.service";

describe("Service: User Service", function () {
  // let User;
  // let getAllUsers;

  beforeEach(() => {
    jest.reset;
  });

  it("should return all blogs", async () => {
    // Given
    const mockBlogs = [
      {
        title: "Pomeriggiato",
        description: "How to make a Italian dish",
        tags: " veg italian pasta-not-broken dish",
        state: "draft",
        blogBody: "Step 1: boil water",
      },
      {
        title: "Nigerian beans ke?",
        description: "How to cook beans in my country",
        state: "published",
        tags: "Chef Chi",
        blogBody: "Step 1: separate the beans",
      },
    ];
    Blog.find = jest
      .fn()
      .mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnValue(mockBlogs),
      });
    // this style below also works
    // jest.spyOn(User, "find").mockReturnValue({
    //   skip: jest.fn().mockReturnThis(),
    //   limit: jest.fn().mockReturnValue(users),
    // });
    // User.countDocuments = jest.fn().mockResolvedValue(mockUsers.length);

    // When
    const result = await UserService.getAllBlogs();

    // Then
    expect(result.data).toEqual(mockBlogs);
    // expect(result.meta).toEqual(mockBlogs.meta);
    expect(Blog.find).toHaveBeenCalledTimes(1);
  });
});
